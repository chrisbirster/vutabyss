-- 0002_card_triggers.sql

-- Add card_count to deck table
ALTER TABLE deck
ADD COLUMN card_count INTEGER NOT NULL DEFAULT 0;

-- Performance updates 
-- Create an index on deck_id in the note table
CREATE INDEX IF NOT EXISTS idx_note_deck_id ON note(deck_id);

-- Create an index on note_id in the card table
CREATE INDEX IF NOT EXISTS idx_card_note_id ON card(note_id);

-- manually update deck counts
UPDATE deck
SET card_count = (
    SELECT COUNT(*)
    FROM card
    JOIN note ON card.note_id = note.id
    WHERE note.deck_id = deck.id
);

-- Triggers to maintain card_count in deck

-- Trigger to increment card_count when a new card is inserted
CREATE TRIGGER IF NOT EXISTS trg_card_insert
AFTER INSERT ON card
FOR EACH ROW
BEGIN
    UPDATE deck
    SET card_count = card_count + 1
    WHERE id = (SELECT deck_id FROM note WHERE id = NEW.note_id);
END;

-- Trigger to decrement card_count when a new card is deleted 
CREATE TRIGGER IF NOT EXISTS trg_card_delete
AFTER DELETE ON card
FOR EACH ROW
BEGIN
    UPDATE deck
    SET card_count = card_count - 1
    WHERE id = (SELECT deck_id FROM note WHERE id = OLD.note_id);
END;

-- Trigger to handle changes in note_id (which may affect deck_id) when a card's note_id is updated
CREATE TRIGGER IF NOT EXISTS trg_card_update_note
AFTER UPDATE OF note_id ON card
FOR EACH ROW
BEGIN
    -- Decrement card_count for the old deck
    UPDATE deck
    SET card_count = card_count - 1
    WHERE id = (SELECT deck_id FROM note WHERE id = OLD.note_id);
    
    -- Increment card_count for the new deck
    UPDATE deck
    SET card_count = card_count + 1
    WHERE id = (SELECT deck_id FROM note WHERE id = NEW.note_id);
END;
