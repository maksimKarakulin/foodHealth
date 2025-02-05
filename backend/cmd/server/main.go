package main

import (
	"context"
	"foodHealth/backend/internal/api/handlers"
	"foodHealth/backend/internal/config"
	"foodHealth/backend/internal/database"
	"foodHealth/backend/internal/router"
	"log"
	"net/http"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.Load() // Load configuration from environment variables
	dbQueries, err := database.NewConnection(cfg.DatabaseURL) // Get *db.Queries
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.CloseConnection(dbQueries)

	// Run database migrations
	if err := runMigrations(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	foodHandler := handlers.NewFoodHandler(dbQueries)
	userHandler := handlers.NewUserHandler(dbQueries)

	r := router.NewRouter(foodHandler, userHandler, cfg, dbQueries) // Pass cfg and dbQueries

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  cfg.ServerReadTimeout,
		WriteTimeout: cfg.ServerWriteTimeout,
		IdleTimeout:  cfg.ServerIdleTimeout,
	}

	log.Printf("Server starting on port %s in %s environment", cfg.Port, cfg.Environment)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}

	// Graceful shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), cfg.ServerShutdownTimeout)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}

	log.Println("Server stopped gracefully")
}

func runMigrations(dbURL string) error {
	migrationDriver, err := migrate.New("file://backend/migrations", dbURL)
	if err != nil {
		return err
	}
	if err := migrationDriver.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}
	log.Println("Database migrations completed successfully.")
	return nil
}
