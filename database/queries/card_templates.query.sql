-- name: CreateCardTemplate :one
INSERT INTO card_template (
  note_type_id,
  template_name,
  front_html,
  back_html,
  css,
  owner_id
)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetCardTemplate :one
SELECT * FROM card_template
WHERE id = ?
LIMIT 1;

-- name: ListCardTemplatesByOwner :many
SELECT * FROM card_template
WHERE owner_id = ?
ORDER BY id;

-- name: ListCardTemplatesByNoteType :many
SELECT * FROM card_template
WHERE owner_id = ?
AND note_type_id = ?
ORDER BY id;

-- name: UpdateCardTemplate :one
UPDATE card_template
SET
  template_name = ?,
  front_html = ?,
  back_html = ?,
  css = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteCardTemplate :exec
DELETE FROM card_template
WHERE id = ?;
