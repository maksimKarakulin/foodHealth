package database

import (
	"database/sql"
	"fmt"
	"log"

	db "foodHealth/backend/internal/database/generated" // Import generated db code
)

// NewConnection opens a new database connection and returns generated Queries.
func NewConnection(dbURL string) (*db.Queries, error) { // Return *db.Queries
	sqldb, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	if err = sqldb.Ping(); err != nil {
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	log.Println("Successfully connected to the database")
	return db.New(sqldb), nil // Initialize and return generated Queries
}

// CloseConnection closes the database connection
func CloseConnection(queries *db.Queries) error {
	if queries != nil {
		if sqlDB := queries.GetDB(); sqlDB != nil {
			return sqlDB.Close()
		}
	}
	return nil
}
