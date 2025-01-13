package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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

// FoodItem represents the food item model
type FoodItem struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	ImageURL    string `json:"image_url,omitempty"`
}

func (h *FoodHandler) GetFoods(c *gin.Context) {
	var foodItems []FoodItem
	if err := h.db.Find(&foodItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, foodItems)
}

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
