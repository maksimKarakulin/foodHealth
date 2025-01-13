package database

import (
	"database/sql"
	"fmt"
)

// Migration represents a database migration
type Migration struct {
	Name string
	SQL  string
}

// Migrations is a slice of all database migrations
var Migrations = []Migration{
	{
		Name: "001_create_users_table",
		SQL: `
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			deleted_at TIMESTAMP WITH TIME ZONE
		);
		`,
	},
	{
		Name: "002_create_food_items_table",
		SQL: `
		CREATE TABLE IF NOT EXISTS food_items (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			description TEXT,
			category VARCHAR(100),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			deleted_at TIMESTAMP WITH TIME ZONE
		);
		`,
	},
	{
		Name: "003_create_nutritional_data_table",
		SQL: `
		CREATE TABLE IF NOT EXISTS nutritional_data (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			food_item_id UUID NOT NULL REFERENCES food_items(id),
			calories INTEGER NOT NULL,
			protein_g DECIMAL(10,2),
			carbohydrates_g DECIMAL(10,2),
			fat_g DECIMAL(10,2),
			fiber_g DECIMAL(10,2),
			sugar_g DECIMAL(10,2),
			serving_size_g INTEGER NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
		`,
	},
	{
		Name: "004_create_meals_table",
		SQL: `
		CREATE TABLE IF NOT EXISTS meals (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID NOT NULL REFERENCES users(id),
			name VARCHAR(255) NOT NULL,
			meal_time TIMESTAMP WITH TIME ZONE NOT NULL,
			notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			deleted_at TIMESTAMP WITH TIME ZONE
		);
		`,
	},
	{
		Name: "005_create_meal_items_table",
		SQL: `
		CREATE TABLE IF NOT EXISTS meal_items (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			meal_id UUID NOT NULL REFERENCES meals(id),
			food_item_id UUID NOT NULL REFERENCES food_items(id),
			quantity INTEGER NOT NULL,
			serving_size_g INTEGER NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
		`,
	},
}

// RunMigrations executes all database migrations
func RunMigrations(db *sql.DB) error {
	// Create migrations table if it doesn't exist
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		return fmt.Errorf("error creating migrations table: %v", err)
	}

	// Run each migration in a transaction
	for _, migration := range Migrations {
		// Check if migration has been applied
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version=$1)", migration.Name).Scan(&exists)
		if err != nil {
			return fmt.Errorf("error checking migration status: %v", err)
		}

		if exists {
			continue
		}

		// Begin transaction
		tx, err := db.Begin()
		if err != nil {
			return fmt.Errorf("error starting transaction: %v", err)
		}

		// Execute migration
		_, err = tx.Exec(migration.SQL)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error executing migration %s: %v", migration.Name, err)
		}

		// Record migration
		_, err = tx.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", migration.Name)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error recording migration %s: %v", migration.Name, err)
		}

		// Commit transaction
		err = tx.Commit()
		if err != nil {
			return fmt.Errorf("error committing migration %s: %v", migration.Name, err)
		}

		fmt.Printf("Applied migration: %s\n", migration.Name)
	}

	return nil
}
