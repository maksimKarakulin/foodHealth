package models

// Nutrient represents a single nutrient in a food item.
type Nutrient struct {
	Name       string  `json:"name"`
	Amount     float64 `json:"amount"`
	Unit       string  `json:"unit"`
	DailyValue float64 `json:"daily_value,omitempty"` // Optional daily value
}

// Food represents a food item.
type Food struct {
	ID            string     `json:"id"` // Keeping as string from original
	Name          string     `json:"name"`
	Description   string     `json:"description"`
	Category      string     `json:"category"` // Keeping from original
	Calories      float64    `json:"calories"`
	ServingSize   float64    `json:"serving_size"`
	ServingUnit   string     `json:"serving_unit"`
	Nutrients     []Nutrient `json:"nutrients"`
	HealthBenefit []string   `json:"health_benefits"`
	Allergens     []string   `json:"allergens,omitempty"`
	CreatedAt     string     `json:"created_at"` // Keeping from original
	UpdatedAt     string     `json:"updated_at"` // Keeping from original
}
