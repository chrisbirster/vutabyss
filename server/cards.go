package server

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

// GetDeckRequest defines the structure for route parameters with validation
type GetDeckRequest struct {
	ID string `param:"deckID" validate:"required,alphanum,len=10"`
}

// CardsResponse defines the structure of the JSON response for cards
type CardListResponse struct {
	Deck  CustomDeckResponse     `json:"deck"`
	Cards []CombinedCardResponse `json:"cards"`
}

// CombinedCardResponse represents a card along with its note details.
type CombinedCardResponse struct {
	CardID       string    `json:"card_id"`
	DueDate      string    `json:"due_date"`
	Stability    float64   `json:"stability"`
	Difficulty   float64   `json:"difficulty"`
	Interval     int64     `json:"interval"`
	Status       string    `json:"status"`
	Reps         int64     `json:"reps"`
	Lapses       int64     `json:"lapses"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	TemplateName string    `json:"template_name"`
	FrontHtml    string    `json:"front_html"`
	BackHtml     string    `json:"back_html"`
	Css          string    `json:"css"`

	// Note-related fields
	NoteID          string `json:"note_id"`
	NoteName        string `json:"note_name"`
	NoteDescription string `json:"note_description"`
	NoteTypeID      string `json:"note_type_id"`
	NoteTypeName    string `json:"note_type_name"`
	NoteFieldID     string `json:"note_field_id"`
	FieldName       string `json:"field_name"`
	FrontContent    string `json:"front_content"`
	BackContent     string `json:"back_content"`
}

type CustomDeckResponse struct {
	DeckID          string `json:"deck_id"`
	DeckName        string `json:"deck_name"`
	DeckDescription string `json:"deck_description"`
	OwnerID         string `json:"owner_id"`
}

func FuncUserCardsByDeck(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}

		// get and validate deckID from request
		var req GetDeckRequest
		err = validateRequest(c, &req)
		if err != nil {
			logging.SlogLogger.Error("Error validating deckID from request", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Failed to validate request",
			})
		}

		rows, err := app.Queries.CardDetailsByDeck(c.Request().Context(), req.ID)
		if err != nil {
			logging.SlogLogger.Error("Error retrieving cards", "error", err, "deck", req.ID)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve cards",
			})
		}

		if len(rows) == 0 {
			return c.JSON(http.StatusNotFound, ErrorResponse{Error: "Deck not found or has no cards"})
		}

		var deck CustomDeckResponse
		cardMap := make(map[string]CombinedCardResponse)

		// Iterate over each row.
		for _, row := range rows {
			// Use the first row to set the deck (they all should be the same).
			if deck.DeckID == "" {
				deck = CustomDeckResponse{
					DeckID:          row.DeckID,
					DeckName:        row.DeckName,
					DeckDescription: convertNullString(row.DeckDescription),
					OwnerID:         row.OwnerID,
				}
			}

			card, exists := cardMap[row.CardID]
			if !exists {
				// Append card details.
				card = CombinedCardResponse{
					DueDate:         convertNullTime(row.DueDate),
					CardID:          row.CardID,
					Stability:       convertNullFloat64(row.Stability),
					Difficulty:      convertNullFloat64(row.Difficulty),
					Interval:        convertNullInt64(row.Interval),
					Status:          convertNullString(row.Status),
					Reps:            convertNullInt64(row.Reps),
					Lapses:          convertNullInt64(row.Lapses),
					CreatedAt:       row.CreatedAt,
					UpdatedAt:       row.UpdatedAt,
					TemplateName:    row.TemplateName,
					FrontHtml:       row.FrontHtml,
					BackHtml:        row.BackHtml,
					Css:             convertNullString(row.Css),
					NoteID:          row.NoteID,
					NoteName:        row.NoteName,
					NoteDescription: convertNullString(row.NoteDescription),
					NoteTypeID:      row.NoteTypeID,
					NoteTypeName:    row.NoteTypeName,
					NoteFieldID:     convertNullString(row.NoteFieldID),
					FrontContent:    "",
					BackContent:     "",
				}

				fieldName := convertNullString(row.FieldName)
				fieldContent := convertNullString(row.FieldContent)
				if fieldName == "Front" {
					card.FrontContent = fieldContent
				} else if fieldName == "Back" {
					card.BackContent = fieldContent
				}

				// Update the map.
				cardMap[row.CardID] = card
			}
		}

		// verify ownership
		if deck.OwnerID != user.ID {
			logging.SlogLogger.Error("Unauthorized access to template", "user", user, "deck", deck)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve deck cards",
			})
		}

		var cards []CombinedCardResponse
		for _, card := range cardMap {
			cards = append(cards, card)
		}

		resp := CardListResponse{
			Deck:  deck,
			Cards: cards,
		}
		return c.JSON(http.StatusOK, resp)
	}
}

// createOneCardWithFocus is if you want to store "FocusCloze" in the card's status or a custom column.
func createOneCardWithFocus(ctx context.Context, q *database.Queries, noteID, templateID string, focus int) error {
	// maybe store FocusCloze in 'status' or a custom col
	statusVal := fmt.Sprintf("clozeFocus=%d", focus)
	log.Printf("statusVal: %s", statusVal)

	_, err := q.CreateCard(ctx, database.CreateCardParams{
		NoteID:         noteID,
		CardTemplateID: templateID,
		DueDate:        sql.NullTime{},
		Stability:      sql.NullFloat64{},
		Difficulty:     sql.NullFloat64{},
		Interval:       sql.NullInt64{},
		Status:         sql.NullString{String: "new", Valid: true},
	})
	return err
}

// createOneCard is a simple helper that inserts a single "cards" row referencing noteID and templateID.
func createOneCard(ctx context.Context, q *database.Queries, noteID, templateID string) error {
	_, err := q.CreateCard(ctx, database.CreateCardParams{
		NoteID:         noteID,
		CardTemplateID: templateID,
		DueDate:        sql.NullTime{Time: time.Now(), Valid: true},
		Stability:      sql.NullFloat64{},
		Difficulty:     sql.NullFloat64{},
		Interval:       sql.NullInt64{},
		Status:         sql.NullString{String: "new", Valid: true},
	})
	return err
}

// GenerateCardsForNote is called after you've created a note and note fields.
// It looks up the relevant card_template(s) for the note_type_id,
// and for each template, it "renders" the front/back with a Go template approach.
// For reverse or multi-cloze, it can create multiple card rows as needed.
func GenerateCardsForNote(
	ctx context.Context,
	q *database.Queries,
	noteID,
	noteTypeID,
	ownerID string,
) error {

	templates, err := q.ListCardTemplatesByNoteType(ctx,
		database.ListCardTemplatesByNoteTypeParams{
			OwnerID:    ownerID,
			NoteTypeID: noteTypeID,
		})
	if err != nil {
		return fmt.Errorf("failed to list templates: %w", err)
	}

	fields, err := q.ListFieldsByNote(ctx, noteID)
	if err != nil {
		return fmt.Errorf("failed to get note fields: %w", err)
	}
	dataMap := make(map[string]interface{})
	for _, f := range fields {
		dataMap[f.FieldName] = f.FieldContent
	}

	for _, tpl := range templates {
		templateName := tpl.TemplateName

		// If it's "Reverse Note Template" and you want 2 directions, you might store front/back in separate records, or do a second template row.
		// We'll assume each row in 'templates' is exactly 1 card creation.

		// If it's a Cloze, let's see if we need single or multi approach:
		if strings.Contains(strings.ToLower(templateName), "cloze") {
			// multi approach, parse placeholders to find c1, c2, etc.
			textVal := dataMap["Text"]
			if textVal == nil {
				continue
			}
			placeholders := findAllPlaceholderNumbers(textVal.(string)) // e.g. [1, 2]

			if len(placeholders) == 0 {
				// treat as single => just generate 1 card
				err := createOneCard(ctx, q, noteID, tpl.ID)
				if err != nil {
					return err
				}
			} else {
				// for each unique placeholder number, create a card with that focus
				uniqueFocuses := uniqueIntSlice(placeholders)
				for _, focus := range uniqueFocuses {
					err := createOneCardWithFocus(ctx, q, noteID, tpl.ID, focus)
					if err != nil {
						return err
					}
				}
			}

		} else {
			// It's a basic or reverse, just produce 1 card from the template
			err := createOneCard(ctx, q, noteID, tpl.ID)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
