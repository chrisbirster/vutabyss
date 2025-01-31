-- name: CreateSession :one
INSERT INTO session (
  user_id,
  mode,
  name,
  session_deck_id
)
VALUES (?, ?, ?, ?)
RETURNING *;

-- name: GetSession :one
SELECT * FROM session
WHERE id = ?
LIMIT 1;

-- name: UpdateSession :one
UPDATE session
SET
  name = ?,
  mode = ?,
  end_time = ?,
  is_active = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteSession :exec
DELETE FROM session
WHERE id = ?;

-- name: AddDeckToSession :one
INSERT INTO session_deck (
  session_id,
  deck_id
)
VALUES (?, ?)
RETURNING *;

-- name: ListSessionDecks :many
SELECT * FROM session_deck
WHERE session_id = ?
ORDER BY id;

-- name: RemoveSessionDeck :exec
DELETE FROM session_deck
WHERE id = ?;

-- name: AddCardToSession :one
INSERT INTO session_card (
  session_id,
  card_id,
  status
)
VALUES (?, ?, ?)
RETURNING *;

-- name: ListSessionCards :many
SELECT * FROM session_card
WHERE session_id = ?
ORDER BY id;

-- name: UpdateSessionCard :one
UPDATE session_card
SET
  status = ?,
  next_cram_due = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE session_id = ?
  AND card_id = ?
RETURNING *;

-- name: RemoveSessionCard :exec
DELETE FROM session_card
WHERE id = ?;

-- name: CreateReview :one
INSERT INTO review (
  card_id,
  rating_id,
  review_seconds,
  new_interval,
  new_stability,
  new_difficulty,
  new_due_date,
  session_id
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetReview :one
SELECT * FROM review
WHERE id = ?
LIMIT 1;

-- name: ListReviewsByCard :many
SELECT * FROM review
WHERE card_id = ?
ORDER BY id;

-- name: DeleteReview :exec
DELETE FROM review
WHERE id = ?;

-- name: CreateRatingEntry :one
INSERT INTO rating (name)
VALUES (?)
RETURNING *;

-- name: ListRatings :many
SELECT * FROM rating
ORDER BY id;
