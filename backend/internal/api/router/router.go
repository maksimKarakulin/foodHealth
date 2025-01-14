package router

import (
	"context"
	"food_App/internal/api/handlers"
	"food_App/internal/api/middleware"
	"food_App/internal/config"

	firebase "firebase.google.com/go/v4"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
	"gorm.io/gorm"
)

func SetupRouter(config *config.Config, db *gorm.DB) (*gin.Engine, error) {
	// Initialize Firebase Admin
	opt := option.WithCredentialsFile("path/to/firebase-credentials.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	authClient, err := app.Auth(context.Background())
	if err != nil {
		return nil, err
	}

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authClient)

	r := gin.Default()

	// Middleware
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.ErrorHandler())

	// Initialize handlers with db
	foodHandler := handlers.NewFoodHandler(db)
	userHandler := handlers.NewUserHandler(db)

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
			protected := users.Group("")
			protected.Use(authMiddleware.AuthRequired())
			{
				protected.GET("/profile", userHandler.GetUserProfile)
				protected.PUT("/preferences", userHandler.UpdatePreferences)
				protected.GET("/favorites", userHandler.GetFavoriteFoods)
			}
		}
	}

	return r, nil
}
