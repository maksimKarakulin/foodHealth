package models

type Nutrient struct { //This is for the food item, basically would be used for % of daily value.
	Name     string  `json:"name"`
	Amount   float64 `json:"amount"`
	Unit     string  `json:"unit"`
	DailyVal float64 `json:"daily_value_percentage"`
}
