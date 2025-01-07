// backend/internal/models/food.go
package models

import (
	"gorm.io/gorm"
)

type Food struct {
	gorm.Model
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
}
