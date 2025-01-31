package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

func OnboardNewUser(ctx context.Context, q *database.Queries, userID, displayName string) error {
	err := GenerateUserTeamAndSettings(ctx, q, userID, displayName)
	if err != nil {
		logging.SlogLogger.Error("Error creating user team and settings", "error", err)
		return errors.New("Error: Unable to create users's team and settings")
	}

	// create note types
	basicNoteType, err := q.CreateNoteType(ctx, database.CreateNoteTypeParams{Name: "Basic Note", Description: sql.NullString{String: "Basic front/back note type"}, OwnerID: userID})
	if err != nil {
		return errors.New("Unable to create basic note type for user")
	}
	log.Printf("User %s note type added. Note Type: %v\n", userID, basicNoteType)

	reverseNoteType, err := q.CreateNoteType(ctx, database.CreateNoteTypeParams{Name: "Reverse Note", Description: sql.NullString{String: "Reverse note creates forward and reverse cards per note"}, OwnerID: userID})
	if err != nil {
		return errors.New("Error: Unable to create reverse note type for user")
	}
	log.Printf("User %s note type added. Note Type: %v\n", userID, reverseNoteType)

	clozeNoteType, err := q.CreateNoteType(ctx, database.CreateNoteTypeParams{Name: "Cloze Note", Description: sql.NullString{String: "Cloze note allows fill-in-the-blank note type"}, OwnerID: userID})

	if err != nil {
		return errors.New("Error: Unable to create cloze note type for user")
	}
	log.Printf("User %s note type added. Note Type: %v\n", userID, clozeNoteType)

	// create card templates

	basicCardTemplate, err := q.CreateCardTemplate(ctx, database.CreateCardTemplateParams{
		NoteTypeID:   basicNoteType.ID,
		TemplateName: "Basic Template",
		FrontHtml:    "Question: {{.Front}}",
		BackHtml:     "Answer: {{.Back}}",
		Css:          sql.NullString{},
		OwnerID:      userID,
	})
	if err != nil {
		return errors.New("Unable to create basic card template for user")
	}
	log.Printf("User %s card template added. Card template: %v\n", userID, basicCardTemplate)

	reverseCardTemplate, err := q.CreateCardTemplate(ctx, database.CreateCardTemplateParams{
		NoteTypeID:   reverseNoteType.ID,
		TemplateName: "Reverse Template",
		FrontHtml:    "{{.Front}}",
		BackHtml:     "{{.Back}}",
		Css:          sql.NullString{},
		OwnerID:      userID,
	})
	if err != nil {
		return errors.New("Unable to create reverse card template for user")
	}
	log.Printf("User %s card template added. Card template: %v\n", userID, reverseCardTemplate)

	clozeCardTemplate, err := q.CreateCardTemplate(ctx, database.CreateCardTemplateParams{
		NoteTypeID:   clozeNoteType.ID,
		TemplateName: "Cloze Template",
		FrontHtml:    "Fill in the blank: {{cloze .Text}}",
		BackHtml:     "{{.Text}}",
		Css:          sql.NullString{},
		OwnerID:      userID,
	})

	if err != nil {
		return errors.New("Error: Unable to create cloze card template for user")
	}
	log.Printf("User %s card template added. Card template: %v\n", userID, clozeCardTemplate)

	startingDeck, err := q.CreateDeck(ctx, database.CreateDeckParams{
		Name:    "Unclaimed Deck",
		OwnerID: userID,
		Description: sql.NullString{
			String: "A collection of all cards not belonging to a Deck",
			Valid:  true,
		},
	})
	if err != nil {
		return errors.New("Error: Unable to create starting deck for user")
	}
	log.Printf("User %s example deck added. Example deck: %v\n", userID, startingDeck)

	exampleDeck, err := q.CreateDeck(ctx, database.CreateDeckParams{
		Name:    "Example Deck",
		OwnerID: userID,
		Description: sql.NullString{
			String: "Example Deck that shows off various card templates",
			Valid:  true,
		},
	})
	if err != nil {
		return errors.New("Error: Unable to create example deck for user")
	}
	log.Printf("User %s example deck added. Example deck: %v\n", userID, exampleDeck)

	err = GenerateExampleNotesAndCards(ctx, q, userID, exampleDeck.ID, basicNoteType.ID, reverseNoteType.ID, clozeNoteType.ID)
	if err != nil {
		return errors.New("Error generating example cards")
	}
	return nil
}

func GenerateExampleNotesAndCards(ctx context.Context, q *database.Queries, userID, deckID, basicNTID, reverseNTID, clozeNTID string) error {
	// 1) Basic note
	basicNote, err := q.CreateNote(ctx, database.CreateNoteParams{
		DeckID: deckID, NoteTypeID: basicNTID, OwnerID: userID,
	})
	if err != nil {
		return fmt.Errorf("creating basic note: %w", err)
	}
	_, err = q.CreateNoteField(ctx, database.CreateNoteFieldParams{
		NoteID:       basicNote.ID,
		FieldName:    "Front",
		FieldContent: "This 1941 drama by Orson Welles is often cited as greatest film.",
	})
	if err != nil {
		return err
	}
	_, err = q.CreateNoteField(ctx, database.CreateNoteFieldParams{
		NoteID:       basicNote.ID,
		FieldName:    "Back",
		FieldContent: "Citizen Kane",
	})
	if err != nil {
		return err
	}
	// Then auto-generate cards for the note
	err = GenerateCardsForNote(ctx, q, basicNote.ID, basicNTID, userID)
	if err != nil {
		return err
	}

	// 2) Reverse note
	revNote, err := q.CreateNote(ctx, database.CreateNoteParams{
		DeckID: deckID, NoteTypeID: reverseNTID, OwnerID: userID,
	})
	if err != nil {
		return fmt.Errorf("creating reverse note: %w", err)
	}
	_, err = q.CreateNoteField(ctx, database.CreateNoteFieldParams{
		NoteID:       revNote.ID,
		FieldName:    "Front",
		FieldContent: "She became the first female Prime Minister in 1979",
	})
	if err != nil {
		return err
	}
	_, err = q.CreateNoteField(ctx, database.CreateNoteFieldParams{
		NoteID:       revNote.ID,
		FieldName:    "Back",
		FieldContent: "Margaret Thatcher",
	})
	if err != nil {
		return err
	}
	err = GenerateCardsForNote(ctx, q, revNote.ID, reverseNTID, userID)
	if err != nil {
		return err
	}

	// 3) Cloze note
	clozeNote, err := q.CreateNote(ctx, database.CreateNoteParams{
		DeckID: deckID, NoteTypeID: clozeNTID, OwnerID: userID,
	})
	if err != nil {
		return fmt.Errorf("creating cloze note: %w", err)
	}
	_, err = q.CreateNoteField(ctx, database.CreateNoteFieldParams{
		NoteID:       clozeNote.ID,
		FieldName:    "Text",
		FieldContent: "Leonardo da Vinci painted the {{c1::Mona Lisa::painting}} and {{c1::The Last Supper}}",
	})
	if err != nil {
		return err
	}
	// The "back" might be same or omitted. It's optional if your system wants it.

	err = GenerateCardsForNote(ctx, q, clozeNote.ID, clozeNTID, userID)
	if err != nil {
		return err
	}

	return nil
}
