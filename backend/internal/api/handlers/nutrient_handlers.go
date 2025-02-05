package handlers

import (
	"net/http"
	"strconv"

	"foodHealth/backend/internal/errors"
	"foodHealth/backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// NutrientHandler handles nutrient-related API requests
type NutrientHandler struct {
	DB *gorm.DB
}

// NewNutrientHandler creates a new NutrientHandler
func NewNutrientHandler(db *gorm.DB) *NutrientHandler {
	return &NutrientHandler{DB: db}
}

// GetNutrient retrieves nutrient information by ID.
func (h *NutrientHandler) GetNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.BadRequest("Invalid nutrient ID", err).Error(), "success": false})
		return
	}

	var nutrient models.Nutrient
	if err := h.DB.First(&nutrient, id).Error; err != nil {
		if errors.IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": errors.NotFound("Nutrient not found", err).Error(), "success": false})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errors.Internal(err).Error(), "success": false})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"nutrient": nutrient, "success": true})
}

// CreateNutrient creates a new nutrient.
func (h *NutrientHandler) CreateNutrient(c *gin.Context) {
	var nutrient models.Nutrient
	if err := c.ShouldBindJSON(&nutrient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.Validation("Invalid nutrient data", err).Error(), "success": false})
		return
	}

	if err := h.DB.Create(&nutrient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": errors.Internal(err).Error(), "success": false})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"nutrient": nutrient, "success": true})
}

//// need to finish these and update this whole file to be honest..

// UpdateNutrient updates an existing nutrient.
func (h *NutrientHandler) UpdateNutrient(c *gin.Context) {

}

// DeleteNutrient deletes a nutrient by ID.
func (h *NutrientHandler) DeleteNutrient(c *gin.Context) {

}
