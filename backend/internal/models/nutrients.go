package models

type NutrientType string

const (
	MacroType NutrientType = "macro"
	MicroType NutrientType = "micro"
	WaterType NutrientType = "water"
)

type BaseNutrient struct {
	ID          uint         `json:"id"`
	Name        string       `json:"name"`
	Description string       `json:"description"`
	Amount      float64      `json:"amount"`
	Unit        string       `json:"unit"`
	DailyVal    float64      `json:"daily_value_percentage"`
	Type        NutrientType `json:"nutrient_type"`
	IsEssential bool         `json:"is_essential"`
	UpperLimit  float64      `json:"upper_limit"`
	RDI         float64      `json:"recommended_daily_intake"`
	Sources     []string     `json:"common_sources"`
	FoodId      uint         `json:"food_id"`
	Food        Food         `json:"food"`
}

type MacroNutrient struct {
	BaseNutrient
	Calories float64 `json:"calories"`
}

type MicroNutrient struct {
	BaseNutrient
	SubType string `json:"sub_type"` // e.g., "vitamin", "mineral"
}

type WaterNutrient struct {
	BaseNutrient
}
