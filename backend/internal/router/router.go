package router

import (
	"foodHealth/backend/internal/api/handlers"
	"foodHealth/backend/internal/api/middleware"
	"foodHealth/backend/internal/config"
	db "foodHealth/backend/internal/database/generated" // Import generated db code
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func NewRouter(foodHandler *handlers.FoodHandler, userHandler *handlers.UserHandler, cfg *config.Config, q *db.Queries) http.Handler {
	r := chi.NewRouter()

	// Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check route
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// API routes
	r.Route("/api", func(apiRouter chi.Router) {
		apiRouter.Route("/foods", func(foodRouter chi.Router) {
			foodRouter.Get("/", foodHandler.GetFoods)
			foodRouter.Post("/", foodHandler.CreateFood)
			foodRouter.Get("/{id}", foodHandler.GetFood)
			foodRouter.Put("/{id}", foodHandler.UpdateFood)
			foodRouter.Delete("/{id}", foodHandler.DeleteFood)
			foodRouter.Get("/search", foodHandler.SearchFoods)
			foodRouter.Get("/category/{category}", foodHandler.GetFoodsByCategory)
		})

		apiRouter.Route("/users", func(userRouter chi.Router) {
			userRouter.Post("/register", userHandler.RegisterUser)
			userRouter.Post("/login", userHandler.LoginUser)

			// Protected routes - example, apply auth middleware here
			userRouter.Group(func(protectedRouter chi.Router) {
				protectedRouter.Use(middleware.AuthMiddleware)
				protectedRouter.Get("/profile", userHandler.GetUserProfile)
				protectedRouter.Put("/preferences", userHandler.UpdatePreferences)
				protectedRouter.Get("/favorites", userHandler.GetFavoriteFoods)
			})
		})
	})

	return r
}
