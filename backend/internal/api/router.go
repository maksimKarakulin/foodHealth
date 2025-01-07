package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Routes
	api := r.Group("/api")
	{
		api.GET("/foods", GetFoods)
		api.POST("/foods", CreateFood)
		// Add more routes
	}

	return r
}
