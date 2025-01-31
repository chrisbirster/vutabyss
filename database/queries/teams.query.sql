-- name: CreateTeam :one
INSERT INTO team (
  name,
  owner_id
)
VALUES (?,?)
RETURNING *;

-- name: GetTeam :one
SELECT * FROM team
WHERE id = ?
LIMIT 1;

-- name: ListTeams :many
SELECT * FROM team
ORDER BY id;

-- name: UpdateTeam :one
UPDATE team
SET
  name = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteTeam :exec
DELETE FROM team
WHERE id = ?;

-- name: AddTeamMember :one
INSERT INTO team_member (
  team_id,
  user_id,
  role
)
VALUES (?, ?, ?)
RETURNING *;

-- name: UpdateTeamMember :one
UPDATE team_member
SET role = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE team_id = ?
  AND user_id = ?
RETURNING *;

-- name: RemoveTeamMember :exec
DELETE FROM team_member
WHERE id = ?;

-- name: ListTeamMembers :many
SELECT * FROM team_member
WHERE team_id = ?;

