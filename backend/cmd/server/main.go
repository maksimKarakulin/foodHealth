// backend/cmd/server/main.go
package main

import (
	"food_App/internal/api"
	"food_App/internal/database"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// Initialize DB
	db := database.Connect()

	// Initialize Router
	router := api.SetupRouter(db)

	// Start server
	log.Println("Starting server on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
