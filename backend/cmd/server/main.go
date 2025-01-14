package main

import (
	"food_App/internal/api/handlers"
	"log"
	"os"
	"time"

	_ "food_App/docs" // This is important!

	"food_App/internal/api/router"

	"food_App/internal/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin" // Because regular gin wasn't fancy enough
	"github.com/joho/godotenv" // Keeping everything a secret!
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger" // Making APIs less mysterious since 2016
	"gorm.io/driver/postgres"                  // The elephant in the room
	"gorm.io/gorm"                             // Goofy name, serious functionality
)

// @title Food Health API
// @version 1.0
// @description Food Health Application API
// @host localhost:8080
// @BasePath /api
func main() {
	// Loads environment variables from .env file
	// AKA "The file developers forget to gitignore until it's too late"
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initializes the database
	// Where all your data goes to party
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN environment variable is required")
	}

	// Attempting to befriend the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Database said no:", err)
	}

	// Get the underlying SQL DB instance
	// Because one database connection pool isn't enough
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Database is having an identity crisis:", err)
	}
	defer sqlDB.Close() // Promise to clean up after ourselves

	// Auto-migrate the schema
	// AKA "The thing you hope doesn't drop your production tables"
	if err := db.AutoMigrate(&handlers.FoodItem{}); err != nil {
		log.Fatal("Migration failed - time to update that resume:", err)
	}

	// Setup router with Gin
	// Because plain HTTP routing is too mainstream
	r := gin.Default()

	// CORS configuration
	// Making browsers happy since... well, forever
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                   // The frontend's VIP pass
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // CRUD + that one method nobody uses
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"}, // Because size matters
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Cache me if you can
	}))

	// Setup Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Initialize handlers with db
	foodHandler := handlers.NewFoodHandler(db)
	userHandler := handlers.NewUserHandler(db)

	// Setup API routes
	api := r.Group("/api")
	{
		foods := api.Group("/foods")
		{
			foods.GET("", foodHandler.GetFoods)
			foods.POST("", foodHandler.CreateFood)
			foods.GET("/:id", foodHandler.GetFood)
			foods.PUT("/:id", foodHandler.UpdateFood)
			foods.DELETE("/:id", foodHandler.DeleteFood)
			foods.GET("/search", foodHandler.SearchFoods)
			foods.GET("/category/:category", foodHandler.GetFoodsByCategory)
		}

		users := api.Group("/users")
		{
			users.POST("/register", userHandler.RegisterUser)
			users.POST("/login", userHandler.LoginUser)
		}
	}

	// Get port from environment variable or use default
	// Port 8080, because 80 was too mainstream
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // The default port of champions
	}

	// Start server
	// May the ports be ever in your favor
	log.Printf("Server starting on port %s - Time to grab some popcorn 🍿", port)

	config := &config.Config{
		Port:        os.Getenv("PORT"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		Environment: os.Getenv("ENVIRONMENT"),
	}

	router, err := router.SetupRouter(config, db)
	if err != nil {
		log.Fatal("Failed to setup router:", err)
	}

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Server crashed and burned:", err) // Time to panic
	}
}
