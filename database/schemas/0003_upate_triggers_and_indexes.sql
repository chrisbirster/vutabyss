-- 0003_update_triggers_and_indexes.sql

-- indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_team_owner_id ON team(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_member_team_id ON team_member(team_id);
CREATE INDEX IF NOT EXISTS idx_team_member_user_id ON team_member(user_id);

-- ensure only one owner per team 
CREATE UNIQUE INDEX IF NOT EXISTS unique_team_owner ON team_member(team_id) WHERE role = 'owner';


-- triggers
CREATE TRIGGER update_card_updated_at
AFTER UPDATE ON card 
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE card
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_card_template_updated_at
AFTER UPDATE ON card_template 
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE card_template
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_deck_updated_at
AFTER UPDATE ON deck 
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE deck 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_deck_collaborator_updated_at
AFTER UPDATE ON deck_collaborator 
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE deck_collaborator
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_note_updated_at
AFTER UPDATE ON note 
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE note 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_note_type_updated_at
AFTER UPDATE ON note_type
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE note_type
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_note_field_updated_at
AFTER UPDATE ON note_field
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE note_field
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_session_updated_at
AFTER UPDATE ON session
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE session 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_session_card_updated_at
AFTER UPDATE ON session_card
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE session_card
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_session_deck_updated_at
AFTER UPDATE ON session_deck
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE session_deck
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_review_updated_at
AFTER UPDATE ON review
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE review
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_team_updated_at
AFTER UPDATE ON team
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE team
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_team_member_updated_at
AFTER UPDATE ON team_member
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE team_member
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_user_updated_at
AFTER UPDATE ON user
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE user
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_auth_provider_updated_at
AFTER UPDATE ON auth_provider
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE auth_provider
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_user_setting_updated_at
AFTER UPDATE ON user_setting
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE user_setting
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_user_event_updated_at
AFTER UPDATE ON user_event
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE user_event
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_user_session_updated_at
AFTER UPDATE ON user_session
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE user_session
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

