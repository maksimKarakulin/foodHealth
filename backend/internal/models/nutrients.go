package models

import (
	"errors"
	"fmt"
)

// NutrientType represents the type of nutrient (macro, micro, or water).
type NutrientType string

const (
	MacroType NutrientType = "macro"
	MicroType NutrientType = "micro"
	WaterType NutrientType = "water"
)

// ValidateNutrientType checks if the provided NutrientType is valid.
func ValidateNutrientType(nutrientType NutrientType) error {
	switch nutrientType {
	case MacroType, MicroType, WaterType:
		return nil
	default:
		return fmt.Errorf("invalid nutrient type: %s", nutrientType)
	}
}

// BaseNutrient represents the common fields for all nutrient types.
type BaseNutrient struct {
	ID                     uint         `json:"id" gorm:"primaryKey"`
	Name                   string       `json:"name" gorm:"uniqueIndex"`
	Description            string       `json:"description"`
	Amount                 float64      `json:"amount"`
	Unit                   string       `json:"unit"`
	DailyValue             float64      `json:"daily_value_percentage"`
	NutrientType           NutrientType `json:"nutrient_type"`
	IsEssential            bool         `json:"is_essential"`
	UpperLimit             float64      `json:"upper_limit"`
	RecommendedDailyIntake float64      `json:"recommended_daily_intake"`
	CommonSources          []string     `json:"common_sources" gorm:"type:text[]"` // Use text[] for array storage in postgres
	FoodID                 uint         `json:"food_id"`
	Food                   Food         `json:"food" gorm:"foreignKey:FoodID"`
}

// Validate ensures the BaseNutrient data is valid.
func (bn *BaseNutrient) Validate() error {
	if bn.Name == "" {
		return errors.New("name is required")
	}
	if bn.Amount <= 0 {
		return errors.New("amount must be greater than zero")
	}
	if err := ValidateNutrientType(bn.NutrientType); err != nil {
		return err
	}
	return nil
}

// MacroNutrient represents macronutrients (carbohydrates, proteins, fats).
type MacroNutrient struct {
	BaseNutrient
	Calories float64 `json:"calories"`
}

// MicroNutrient represents micronutrients (vitamins, minerals).
type MicroNutrient struct {
	BaseNutrient
	SubType string `json:"sub_type"` // e.g., "vitamin", "mineral"
}

// WaterNutrient represents water content.
type WaterNutrient struct {
	BaseNutrient
}

// Example of how to use validation:
func CreateNutrient(nutrientData BaseNutrient) (*BaseNutrient, error) {
	if err := nutrientData.Validate(); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}
	// Add the nutrient to the database.
	// ... database interaction code ...
	return &nutrientData, nil
}
