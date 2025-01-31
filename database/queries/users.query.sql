-- name: GetUser :one
SELECT * FROM user
WHERE id = ?
LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM user
WHERE email = ?
LIMIT 1;

-- name: ListUsers :many
SELECT * FROM user
ORDER BY id;

-- name: CreateUser :one
INSERT INTO user (
  email,
  password_hash,
  display_name
)
VALUES (?, ?, ?)
RETURNING *;

-- name: UpdateUser :one
UPDATE user
SET
  email = ?,
  password_hash = ?,
  display_name = ?,
  is_verified = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM user
WHERE id = ?;

-----------------------------------------
-- AuthProviders
-----------------------------------------

-- name: CreateAuthProvider :one
INSERT INTO auth_provider (
    user_id,
    provider_name,
    provider_user_id
)
VALUES (?, ?, ?)
RETURNING *;

-- name: GetAuthProviderByUserAndName :one
SELECT * FROM auth_provider
WHERE user_id = ?
  AND provider_name = ?
LIMIT 1;

-- name: DeleteAuthProvider :exec
DELETE FROM auth_provider
WHERE id = ?;

-- name: GetUserSetting :one
SELECT * FROM user_setting
WHERE user_id = ?
LIMIT 1;

-- name: CreateUserSetting :one
INSERT INTO user_setting (
  user_id,
  theme,
  daily_new_cards_limit,
  notifications_enabled,
  tutorial_enabled
)
VALUES (?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateUserSetting :one
UPDATE user_setting
SET
  theme = ?,
  daily_new_cards_limit = ?,
  notifications_enabled = ?,
  tutorial_enabled = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE user_id = ?
RETURNING *;
