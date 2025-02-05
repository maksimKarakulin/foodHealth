package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"foodHealth/backend/internal/database/generated"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type FoodHandler struct {
	q *db.Queries
}

func NewFoodHandler(q *db.Queries) *FoodHandler {
	return &FoodHandler{
		q: q,
	}
}

func (h *FoodHandler) GetFoods(w http.ResponseWriter, r *http.Request) {
	foods, err := h.q.ListFoods(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch foods: "+err.Error(), http.StatusInternalServerError) // Include error message in response
		return
	}

	apiFoods := make([]FoodItem, len(foods))
	for i, food := range foods {
		apiFoods[i] = convertDBFoodItemToAPI(food)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(apiFoods); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

func (h *FoodHandler) CreateFood(w http.ResponseWriter, r *http.Request) {
	var foodItem FoodItem
	if err := json.NewDecoder(r.Body).Decode(&foodItem); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest) // Include error message
		return
	}
	defer r.Body.Close()

	params := db.CreateFoodParams{
		Name:        foodItem.Name,
		Description: foodItem.Description,
		Category:    foodItem.Category,
		ImageURL:    sql.NullString{String: foodItem.ImageURL, Valid: foodItem.ImageURL != ""}, // Handle nullable string properly
	}

	createdFood, err := h.q.CreateFood(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to create food item: "+err.Error(), http.StatusInternalServerError) // Include error message
		return
	}

	apiFood := convertDBFoodItemToAPI(createdFood)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(apiFood); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

func (h *FoodHandler) GetFood(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	foodID, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid food ID: "+err.Error(), http.StatusBadRequest) // Include error message
		return
	}

	food, err := h.q.GetFood(r.Context(), foodID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Food item not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to fetch food item: "+err.Error(), http.StatusInternalServerError) // Include error message
		}
		return
	}

	apiFood := convertDBFoodItemToAPI(food)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(apiFood); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

func (h *FoodHandler) UpdateFood(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	foodID, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid food ID: "+err.Error(), http.StatusBadRequest) // Include error message
		return
	}

	var foodItem FoodItem
	if err := json.NewDecoder(r.Body).Decode(&foodItem); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest) // Include error message
		return
	}
	defer r.Body.Close()

	params := db.UpdateFoodParams{
		ID:          foodID,
		Name:        foodItem.Name,
		Description: foodItem.Description,
		Category:    foodItem.Category,
		ImageURL:    sql.NullString{String: foodItem.ImageURL, Valid: foodItem.ImageURL != ""}, // Handle nullable string properly
	}

	updatedFood, err := h.q.UpdateFood(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to update food item: "+err.Error(), http.StatusInternalServerError) // Include error message
		return
	}

	apiFood := convertDBFoodItemToAPI(updatedFood)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(apiFood); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

func (h *FoodHandler) DeleteFood(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	foodID, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid food ID: "+err.Error(), http.StatusBadRequest) // Include error message
		return
	}

	if err := h.q.DeleteFood(r.Context(), foodID); err != nil {
		http.Error(w, "Failed to delete food item: "+err.Error(), http.StatusInternalServerError) // Include error message
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Food item deleted successfully"))
}

func (h *FoodHandler) SearchFoods(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Search query is required", http.StatusBadRequest)
		return
	}

	params := db.SearchFoodsParams{
		Name: "%" + query + "%",
	}

	foods, err := h.q.SearchFoods(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to search foods: "+err.Error(), http.StatusInternalServerError) // Include error message
		return
	}

	apiFoods := make([]FoodItem, len(foods))
	for i, food := range foods {
		apiFoods[i] = convertDBFoodItemToAPI(food)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(apiFoods); err != nil {
		http.Error(w, "Error encoding JSON: "+err.Error(), http.StatusInternalServerError) // Handle encoding error
	}
}

func (h *FoodHandler) GetFoodsByCategory(w http.ResponseWriter, r *http.Request) {
	category := chi.URLParam(r, "category")

	foods, err := h.q.ListFoodsByCategory(r.Context(), category)
	if err != nil {
		http.Error(w, "Failed to fetch foods by category: "+err.Error(), http.StatusInternalServerError) // Include error message
		return
	}

	apiFoods := make([]FoodItem, len(foods))
	for i, food := range foods {
		apiFoods[i] = convertDBFoodItemToAPI(food)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiFoods)
}

// Utility function to convert db.FoodItem to handlers.FoodItem
func convertDBFoodItemToAPI(food db.FoodItem) FoodItem {
	return FoodItem{
		ID:          food.ID.String(),
		CreatedAt:   food.CreatedAt,
		UpdatedAt:   food.UpdatedAt,
		DeletedAt:   food.DeletedAt,
		Name:        food.Name,
		Description: food.Description,
		Category:    food.Category,
		ImageURL:    food.ImageURL.String, // Safely access nullable string
	}
}
