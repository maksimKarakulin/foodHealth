// /hello
package models

type Food struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	Category      string     `json:"category"`
	Calories      float64    `json:"calories"`
	ServingSize   float64    `json:"serving_size"`
	ServingUnit   string     `json:"serving_unit"`
	Nutrients     []Nutrient `json:"nutrients"`
	HealthBenefit []string   `json:"health_benefits"`
	Allergens     []string   `json:"allergens,omitempty"`
	CreatedAt     string     `json:"created_at"`
	UpdatedAt     string     `json:"updated_at"`
}
