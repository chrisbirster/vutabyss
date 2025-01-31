-- name: CreateCard :one
INSERT INTO card (
  note_id,
  card_template_id,
  due_date,
  stability,
  difficulty,
  interval,
  status
)
VALUES (?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: GetCard :one
SELECT * FROM card
WHERE id = ?
LIMIT 1;

-- name: ListCardsByNote :many
SELECT * FROM card
WHERE note_id = ?
ORDER BY id;

-- name: UpdateCardScheduling :one
UPDATE card
SET
  due_date = ?,
  stability = ?,
  difficulty = ?,
  interval = ?,
  status = ?,
  reps = ?,
  lapses = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteCard :exec
DELETE FROM card
WHERE id = ?;

-- name: CardDetailsByDeck :many
SELECT
    n.id AS note_id,
    nt.id AS note_type_id,
    nt.name AS note_type_name,
    nf.id AS note_field_id,
    nf.field_name,
    nf.field_content,
    d.id AS deck_id,
    d.name AS deck_name,
    d.description AS deck_description,
    c.due_date,
    c.id AS card_id,
    ct.template_name,
    ct.front_html,
    ct.back_html
FROM
    note n
JOIN
    note_type nt ON n.note_type_id = nt.id
JOIN
    deck d ON n.deck_id = d.id
JOIN
    card c ON n.id = c.note_id
JOIN
    card_template ct ON c.card_template_id = ct.id
LEFT JOIN
    note_field nf ON n.id = nf.note_id
WHERE
    d.id = ?
ORDER BY c.created_at;
