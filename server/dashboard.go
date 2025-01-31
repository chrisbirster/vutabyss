package server

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
)

type UserResourcesResponse struct {
	Decks         []database.Deck         `json:"decks"`
	NoteTypes     []database.NoteType     `json:"note_types"`
	CardTemplates []database.CardTemplate `json:"card_templates"`
	Notes         []database.Note         `json:"notes"`
	Cards         []database.Card         `json:"cards"`
}

func FuncUserResources(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, ok := c.Get("user").(database.User)
		if !ok {
			log.Printf("Invalid user type in context, %v", user)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
			})
		}

		var decks []database.Deck
		ownedDecks, err := app.Queries.ListDecksByOwnerId(c.Request().Context(), user.ID)
		if err != nil {
			log.Printf("Error getting decks by user: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to retrieve user-owned decks",
			})
		}
		decks = append(decks, ownedDecks...)

		sharedDecks, err := app.Queries.ListSharedDecks(c.Request().Context(), user.ID)
		if err != nil {
			log.Printf("Error getting decks shared with user: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to retrieve decks shared with user",
			})
		}
		decks = append(decks, sharedDecks...)

		noteTypes, err := app.Queries.ListNoteTypesByOwner(c.Request().Context(), user.ID)
		if err != nil {
			log.Printf("Error getting note types: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to retrieve user's note types",
			})
		}

		cardTemplates, err := app.Queries.ListCardTemplatesByOwner(c.Request().Context(), user.ID)
		if err != nil {
			log.Printf("Error getting card templates: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to retrieve user's card templates",
			})
		}

		var notes []database.Note
		for _, deck := range ownedDecks {
			notesFromDeck, err := app.Queries.ListNotesByDeck(c.Request().Context(), deck.ID)
			if err != nil {
				log.Printf("Error getting notes: %v", err)
				return c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error: "Unable to retrieve notes",
				})
			}
			notes = append(notes, notesFromDeck...)
		}

		var cards []database.Card
		for _, note := range notes {
			cardsFromNote, err := app.Queries.ListCardsByNote(c.Request().Context(), note.ID)
			if err != nil {
				log.Printf("Error getting cards: %v", err)
				return c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error: "Unable to retrieve cards",
				})
			}
			cards = append(cards, cardsFromNote...)
		}
		response := UserResourcesResponse{
			Decks:         decks,
			NoteTypes:     noteTypes,
			CardTemplates: cardTemplates,
			Notes:         notes,
			Cards:         cards,
		}

		return c.JSON(http.StatusOK, response)
	}
}
