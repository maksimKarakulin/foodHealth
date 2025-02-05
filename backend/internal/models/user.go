package models

type User struct {
	ID           string   `json:"id"`
	Email        string   `json:"email"`
	Password     string   `json:"-"`
	Preferences  []string `json:"dietary_preferences,omitempty"`
	Restrictions []string `json:"dietary_restrictions,omitempty"`
	CreatedAt    string   `json:"created_at"`
	UpdatedAt    string   `json:"updated_at"`
}
