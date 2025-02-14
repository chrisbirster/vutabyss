-- 001_initial_setup.sql

CREATE TABLE IF NOT EXISTS card (
    id               TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    note_id          TEXT NOT NULL,
    card_template_id TEXT NOT NULL,
    due_date         DATETIME,
    stability        REAL,
    difficulty       REAL,
    interval         INTEGER,
    status           TEXT CHECK (status IN ('new', 'learning', 'review')),
    reps             INTEGER DEFAULT 0,
    lapses           INTEGER DEFAULT 0,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(note_id)          REFERENCES note(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(card_template_id) REFERENCES card_template(id) ON DELETE SET NULL ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS card_template (
    id             TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    note_type_id   TEXT NOT NULL,
    template_name  TEXT NOT NULL,
    front_html     TEXT NOT NULL,
    back_html      TEXT NOT NULL,
    css            TEXT,
    owner_id       TEXT NOT NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(note_type_id) REFERENCES note_type(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS deck (
    id          TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    name        TEXT NOT NULL,
    owner_id    TEXT NOT NULL,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS deck_collaborator (
    id         TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    deck_id    TEXT NOT NULL,
    user_id    TEXT NOT NULL,
    role       TEXT NOT NULL CHECK (role in ('admin', 'editor', 'viewer')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(deck_id) REFERENCES deck(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS note (
    id            TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    deck_id       TEXT NOT NULL,
    note_type_id  TEXT NOT NULL,
    owner_id      TEXT NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(deck_id) REFERENCES deck(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(note_type_id) REFERENCES note_type(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE SET NULL ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS note_type (
    id          TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    name        TEXT NOT NULL,
    description TEXT,
    owner_id    TEXT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS note_field (
    id            TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    note_id       TEXT NOT NULL,
    field_name    TEXT NOT NULL,
    field_content TEXT NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(note_id) REFERENCES note(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS session (
    id               TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    user_id          TEXT NOT NULL,
    mode             TEXT CHECK (mode IN ('normal', 'cram')),
    name             TEXT,
    start_time       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time         DATETIME,
    is_active        BOOLEAN NOT NULL DEFAULT 1,
    session_deck_id  TEXT NOT NULL,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(session_deck_id) REFERENCES session_deck(id) ON DELETE SET NULL ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS session_card (
    id            TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    session_id    TEXT NOT NULL,
    card_id       TEXT NOT NULL,
    status        TEXT CHECK (status IN ('pending, in-progress, done')),
    next_cram_due DATETIME,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES session(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(card_id)    REFERENCES card(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS session_deck (
    id              TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    session_id      TEXT NOT NULL,
    deck_id         TEXT NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES session(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(deck_id)    REFERENCES deck(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS rating (
    id    TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    name  TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS review (
    id             TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    card_id        TEXT NOT NULL,
    review_time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rating_id      TEXT, 
    review_seconds INTEGER,
    new_interval   INTEGER,
    new_stability  REAL,
    new_difficulty REAL,
    new_due_date   DATETIME,
    session_id     TEXT,          
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(card_id)   REFERENCES card(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(session_id) REFERENCES session(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(rating_id)   REFERENCES rating(id) ON DELETE SET NULL ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS team (
    id         TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    name       TEXT NOT NULL,
    owner_id   TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS team_member (
    id         TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    team_id    TEXT NOT NULL,
    user_id    TEXT NOT NULL,
    role       TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'viewer', 'editor' ) ),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(team_id) REFERENCES team(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS user (
    id            TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    display_name  TEXT,
    is_verified   BOOLEAN NOT NULL DEFAULT 0,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS auth_provider (
    id               TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    user_id          TEXT NOT NULL,
    provider_name    TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS user_setting (
    id                    TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    user_id               TEXT NOT NULL,
    theme                 TEXT,
    daily_new_cards_limit INTEGER NOT NULL DEFAULT 10,
    notifications_enabled BOOLEAN NOT NULL DEFAULT 0,
    tutorial_enabled      BOOLEAN NOT NULL DEFAULT 0,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS user_event (
    id           TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    user_id      TEXT NOT NULL,
    event_type   TEXT CHECK (event_type IN ('vacation', 'amnesia')),
    start_date   DATETIME NOT NULL,
    end_date     DATETIME,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS user_session (
    id            TEXT PRIMARY KEY DEFAULT (SUBSTR(LOWER(HEX(RANDOMBLOB(10))), 1, 10)),
    user_id       TEXT NOT NULL,
    expires_at    DATETIME,
    is_revoked    BOOLEAN NOT NULL DEFAULT 0,
    user_agent    TEXT,
    ip_address    TEXT,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;
