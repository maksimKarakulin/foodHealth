-- name: GetFood :one
SELECT * FROM food_items
WHERE id = $1 LIMIT 1;

-- name: ListFoods :many
SELECT * FROM food_items
ORDER BY name;

-- name: CreateFood :one
INSERT INTO food_items (
  name, description, category, image_url
) VALUES (
  $1, $2, $3, $4
)
RETURNING *;

-- name: UpdateFood :one
UPDATE food_items
SET name = $2,
    description = $3,
    category = $4,
    image_url = $5,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteFood :exec
DELETE FROM food_items
WHERE id = $1;

-- name: SearchFoods :many
SELECT * FROM food_items
WHERE name ILIKE $1
ORDER BY name;

-- name: ListFoodsByCategory :many
SELECT * FROM food_items
WHERE category = $1
ORDER BY name;
