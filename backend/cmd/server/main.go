package main

import (
	"food_App/internal/api/handlers"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin" // Because regular gin wasn't fancy enough
	"github.com/joho/godotenv" // Keeping everything a secret!
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger" // Making APIs less mysterious since 2016
	"gorm.io/driver/postgres"                  // The elephant in the room
	"gorm.io/gorm"                             // Goofy name, serious functionality
)

func main() {
	// Loads environment variables from .env file
	// AKA "The file developers forget to gitignore until it's too late"
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found - living dangerously, I see...")
	}

	// Initializes the database
	// Where all your data goes to party
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {

		// Ah, the classic "it works on my machine" configuration
		dsn = "host=localhost user=postgres password=postgres dbname=food_app port=5432 sslmode=disable"
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

	// Initialize handlers
	// Where the magic happens (and by magic, we mean bugs)
	foodHandler := handlers.NewFoodHandler(db)

	// API routes
	// The GPS for your HTTP requests
	api := r.Group("/api/v1")
	{
		api.GET("/food", foodHandler.GetFoods)                              // Buffet line starts here
		api.POST("/food", foodHandler.CreateFood)                           // Adding to the menu
		api.GET("/food/:id", foodHandler.GetFood)                           // Finding that one specific nugget
		api.PUT("/food/:id", foodHandler.UpdateFood)                        // When the recipe needs tweaking
		api.DELETE("/food/:id", foodHandler.DeleteFood)                     // Gone, reduced to atoms
		api.GET("/food/search", foodHandler.SearchFoods)                    // For the picky eaters
		api.GET("/food/category/:category", foodHandler.GetFoodsByCategory) // Food segregation
	}

	// Swagger documentation endpoint
	// Because nobody reads the docs anyway
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Get port from environment variable or use default
	// Port 8080, because 80 was too mainstream
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // The default port of champions
	}

	// Start server
	// May the ports be ever in your favor
	log.Printf("Server starting on port %s - Time to grab some popcorn 🍿", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server crashed and burned:", err) // Time to panic
	}
}
