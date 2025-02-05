package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"foodHealth/backend/internal/api/auth"
	db "foodHealth/backend/internal/database/generated"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type UserHandler struct {
	q *db.Queries
}

func NewUserHandler(q *db.Queries) *UserHandler {
	return &UserHandler{q: q}
}

func (h *UserHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	hashedPassword, err := auth.HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Failed to hash password: "+err.Error(), http.StatusInternalServerError)
		return
	}

	params := db.CreateUserParams{
		Email:        user.Email,
		PasswordHash: []byte(hashedPassword),
		Name:         user.Name,
	}

	createdUser, err := h.q.CreateUser(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to register user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	apiUser := convertDBUserToAPI(createdUser)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(apiUser); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError)
	}
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	user, err := h.q.GetUserByEmail(r.Context(), credentials.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			http.Error(w, "Login failed: "+err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if err := auth.ComparePasswords(string(user.PasswordHash), credentials.Password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateJWT(user.ID.String())
	if err != nil {
		http.Error(w, "Failed to generate JWT token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{"token": token}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

// Placeholder user handlers - to be implemented, auth middleware will be applied to these later
func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GetUserProfile - Not implemented yet - Protected Route"))
}

func (h *UserHandler) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("UpdatePreferences - Not implemented yet - Protected Route"))
}

func (h *UserHandler) GetFavoriteFoods(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GetFavoriteFoods - Not implemented yet - Protected Route"))
}


// Utility function to convert db.User to handlers.User
func convertDBUserToAPI(user db.User) User {
	return User{
		ID:          user.ID.String(),
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
		Email:       user.Email,
		Name:        user.Name,
		// PasswordHash is intentionally not included in API response
	}
}
