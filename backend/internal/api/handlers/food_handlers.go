package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// FoodItem represents the food item model
// @Description Food item information
type FoodItem struct {
	ID          string     `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	CreatedAt   time.Time  `json:"created_at" example:"2024-01-13T17:57:41.915Z"`
	UpdatedAt   time.Time  `json:"updated_at" example:"2024-01-13T17:57:41.915Z"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
	Name        string     `json:"name" example:"Banana"`
	Description string     `json:"description" example:"Fresh yellow banana"`
	Category    string     `json:"category" example:"Fruits"`
	ImageURL    string     `json:"image_url,omitempty" example:"https://example.com/banana.jpg"`
}

// @title Food Health API
// @version 1.0
// @description Food Health Application API
// @host localhost:8080
// @BasePath /api

// FoodHandler contains the dependencies for food-related handlers
type FoodHandler struct {
	db *gorm.DB
}

// NewFoodHandler creates a new FoodHandler instance
func NewFoodHandler(db *gorm.DB) *FoodHandler {
	return &FoodHandler{
		db: db,
	}
}

// GetFoods godoc
// @Summary Get all food items
// @Description Get a list of all food items
// @Tags foods
// @Accept json
// @Produce json
// @Success 200 {array} FoodItem
// @Router /foods [get]
func (h *FoodHandler) GetFoods(c *gin.Context) {
	var foodItems []FoodItem
	if err := h.db.Find(&foodItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, foodItems)
}

// CreateFood godoc
// @Summary Create a new food item
// @Description Create a new food item with the provided data
// @Tags foods
// @Accept json
// @Produce json
// @Param food body FoodItem true "Food item to create"
// @Success 201 {object} FoodItem
// @Router /foods [post]
func (h *FoodHandler) CreateFood(c *gin.Context) {
	var foodItem FoodItem
	if err := c.ShouldBindJSON(&foodItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&foodItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, foodItem)
}

func (h *FoodHandler) GetFood(c *gin.Context) {
	id := c.Param("id")
	var foodItem FoodItem

	if err := h.db.First(&foodItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}
	c.JSON(http.StatusOK, foodItem)
}

func (h *FoodHandler) UpdateFood(c *gin.Context) {
	id := c.Param("id")
	var foodItem FoodItem

	if err := h.db.First(&foodItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}

	if err := c.ShouldBindJSON(&foodItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Save(&foodItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, foodItem)
}

func (h *FoodHandler) DeleteFood(c *gin.Context) {
	id := c.Param("id")
	if err := h.db.Delete(&FoodItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Food item deleted"})
}

func (h *FoodHandler) SearchFoods(c *gin.Context) {
	query := c.Query("q")
	var foodItems []FoodItem

	if err := h.db.Where("name ILIKE ?", "%"+query+"%").Find(&foodItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, foodItems)
}

func (h *FoodHandler) GetFoodsByCategory(c *gin.Context) {
	category := c.Param("category")
	var foodItems []FoodItem

	if err := h.db.Where("category = ?", category).Find(&foodItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, foodItems)
}

func (h *FoodHandler) GetNutritionInfo(c *gin.Context) {
	id := c.Param("id")
	var foodItem FoodItem

	if err := h.db.First(&foodItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}
	c.JSON(http.StatusOK, foodItem)
}
