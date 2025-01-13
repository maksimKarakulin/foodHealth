package router

import (
	"food_App/internal/api/handlers"
	"food_App/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Middleware
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.ErrorHandler())

	// Initialize handlers
	foodHandler := &handlers.FoodHandler{}
	userHandler := &handlers.UserHandler{}

	// API routes group
	api := r.Group("/api")
	{
		// Food routes
		foods := api.Group("/foods")
		{
			foods.GET("", foodHandler.GetFoods)
			foods.POST("", foodHandler.CreateFood)
			foods.GET("/:id", foodHandler.GetFood)
			foods.PUT("/:id", foodHandler.UpdateFood)
			foods.DELETE("/:id", foodHandler.DeleteFood)
			foods.GET("/search", foodHandler.SearchFoods)
			foods.GET("/:id/nutrition", foodHandler.GetNutritionInfo)
			foods.GET("/category/:category", foodHandler.GetFoodsByCategory)
		}

		// User routes
		users := api.Group("/users")
		{
			users.POST("/register", userHandler.RegisterUser)
			users.POST("/login", userHandler.LoginUser)

			// Protected routes
			authorized := users.Use(middleware.AuthMiddleware())
			{
				authorized.GET("/profile", userHandler.GetUserProfile)
				authorized.PUT("/preferences", userHandler.UpdatePreferences)
				authorized.GET("/favorites", userHandler.GetFavoriteFoods)
			}
		}
	}

	return r
}
