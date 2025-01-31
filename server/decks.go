package server

import (
	"database/sql"
	"net/http"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

type DeckResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	CardCount   int64     `json:"card_count"`
}

type DecksResponse struct {
	Decks []DeckResponse `json:"decks"`
}

func FuncGetDecksHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract user from context
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}

		ctx := c.Request().Context()
		var wg sync.WaitGroup
		var ownedDecks, sharedDecks []database.Deck
		var ownedErr, sharedErr error
		wg.Add(2)

		// fetch all decks for user
		go func() {
			defer wg.Done()
			ownedDecks, ownedErr = app.Queries.ListDecksByOwnerId(ctx, user.ID)
		}()

		go func() {
			defer wg.Done()
			sharedDecks, sharedErr = app.Queries.ListSharedDecks(ctx, user.ID)
		}()

		wg.Wait()

		// handle errors
		if ownedErr != nil {
			logging.SlogLogger.Error("Error fetching owned decks for user", "user", user.ID, "error", ownedErr)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve owner's decks",
			})
		}

		if sharedErr != nil {
			logging.SlogLogger.Error("Error fetching shared decks for user", "user", user.ID, "error", sharedErr)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve decks shared with user",
			})
		}

		// convert to response
		allDecks := append(ownedDecks, sharedDecks...)
		responseDecks := convertToDecksResponse(allDecks)
		response := DecksResponse{
			Decks: responseDecks,
		}

		return c.JSON(http.StatusOK, response)
	}
}

type CreateDeckRequest struct {
	Name        string  `json:"name" validate:"required"`
	Description *string `json:"description,omitempty"`
}

type CreateDeckResponse struct {
	Message string `json:"message"`
	DeckID  string `json:"deck_id"`
}

func FuncCreateDeckHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract user from context
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}

		var req CreateDeckRequest
		err = validateRequest(c, &req)
		if err != nil {
			logging.SlogLogger.Error("Error validating create deck request", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Failed to validate request",
			})
		}

		// handle optional fields
		var description sql.NullString
		if req.Description != nil && *req.Description != "" {
			description = sql.NullString{
				String: *req.Description,
				Valid:  true,
			}
		} else {
			description = sql.NullString{
				String: "",
				Valid:  false,
			}
		}

		deck, err := app.Queries.CreateDeck(c.Request().Context(), database.CreateDeckParams{
			Name:        req.Name,
			Description: description,
			OwnerID:     user.ID,
		})
		if err != nil {
			logging.SlogLogger.Error("Error creating new deck", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to create new deck",
			})
		}

		logging.SlogLogger.Info("Info: New deck created", "deck", deck)
		response := CreateDeckResponse{
			Message: "create deck is successful",
			DeckID:  deck.ID,
		}
		return c.JSON(http.StatusOK, response)
	}
}

// convertDecksToResponse converts a slice of database.Deck to a slice of DeckResponse.
func convertToDecksResponse(decks []database.Deck) []DeckResponse {
	responseDecks := make([]DeckResponse, 0, len(decks))
	for _, deck := range decks {
		responseDecks = append(responseDecks, convertToDeckResponse(deck))
	}
	return responseDecks
}

// convertDeckToResponse converts a database.Deck to a DeckResponse.
// It gracefully handles nullable fields.
func convertToDeckResponse(deck database.Deck) DeckResponse {
	description := ""
	if deck.Description.Valid {
		description = deck.Description.String
	}
	return DeckResponse{
		ID:          deck.ID,
		Name:        deck.Name,
		Description: description,
		CreatedAt:   deck.CreatedAt,
		UpdatedAt:   deck.UpdatedAt,
		CardCount:   deck.CardCount,
	}
}
