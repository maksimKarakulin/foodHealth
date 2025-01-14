package middleware

import (
	"context"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	client *auth.Client
}

func NewAuthMiddleware(client *auth.Client) *AuthMiddleware {
	return &AuthMiddleware{
		client: client,
	}
}

func (m *AuthMiddleware) AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "Authorization header required"})
			return
		}

		idToken := strings.Replace(authHeader, "Bearer ", "", 1)
		if idToken == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token format"})
			return
		}

		token, err := m.client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
			return
		}

		// Add verified user claims to context
		c.Set("user", token.Claims)
		c.Next()
	}
}
