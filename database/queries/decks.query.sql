-- name: CreateDeck :one
INSERT INTO deck (
  name,
  owner_id,
  description
)
VALUES (?, ?, ?)
RETURNING *;

-- name: GetDeck :one
SELECT * FROM deck
WHERE id = ?
LIMIT 1;

-- name: GetDeckById :one
SELECT * FROM deck
WHERE id = ?
LIMIT 1;

-- name: ListDecksByOwnerId :many
SELECT * FROM deck
WHERE owner_id = ?
ORDER BY id;

-- name: UpdateDeck :one
UPDATE deck
SET
  name = ?,
  description = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteDeck :exec
DELETE FROM deck
WHERE id = ?;

-- name: AddDeckCollaborator :one
INSERT INTO deck_collaborator (
  deck_id,
  user_id,
  role
)
VALUES (?, ?, ?)
RETURNING *;

-- name: UpdateDeckCollaborator :one
UPDATE deck_collaborator
SET role = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE deck_id = ?
  AND user_id = ?
RETURNING *;

-- name: RemoveDeckCollaborator :exec
DELETE FROM deck_collaborator
WHERE id = ?;

-- name: ListDeckCollaborators :many
SELECT * FROM deck_collaborator
WHERE deck_id = ?;

-- name: ListSharedDecks :many
SELECT deck.*
FROM deck
JOIN deck_collaborator ON deck.id = deck_collaborator.deck_id
WHERE deck_collaborator.user_id = ?
ORDER BY deck.id;
