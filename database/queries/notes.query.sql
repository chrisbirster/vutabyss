-- name: CreateNoteType :one
INSERT INTO note_type (
  name,
  description,
  owner_id
)
VALUES (?, ?, ?)
RETURNING *;

-- name: GetNoteType :one
SELECT * FROM note_type
WHERE id = ?
LIMIT 1;

-- name: ListNoteTypesByOwner :many
SELECT * FROM note_type
WHERE owner_id = ?
ORDER BY id;

-- name: UpdateNoteType :one
UPDATE note_type
SET
  name = ?,
  description = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteNoteType :exec
DELETE FROM note_type
WHERE id = ?;

-- name: CreateNote :one
INSERT INTO note (
  deck_id,
  note_type_id,
  owner_id
)
VALUES (?, ?, ?)
RETURNING *;

-- name: GetNote :one
SELECT * FROM note
WHERE id = ?
LIMIT 1;

-- name: ListNotesByDeck :many
SELECT * FROM note
WHERE deck_id = ?
ORDER BY id;

-- name: UpdateNote :one
UPDATE note
SET
  note_type_id = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteNote :exec
DELETE FROM note
WHERE id = ?;

-- name: CreateNoteField :one
INSERT INTO note_field (
  note_id,
  field_name,
  field_content
)
VALUES (?, ?, ?)
RETURNING *;

-- name: ListFieldsByNote :many
SELECT * FROM note_field
WHERE note_id = ?
ORDER BY id;

-- name: UpdateNoteField :one
UPDATE note_field
SET
  field_content = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE note_id = ?
  AND field_name = ?
RETURNING *;

-- name: DeleteNoteField :exec
DELETE FROM note_field
WHERE id = ?;

