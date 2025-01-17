package middleware

import (
	"foodHealth/backend/internal/errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()

			// Try to assert to AppError first.
			if appErr, ok := err.Err.(*errors.AppError); ok {
				c.JSON(appErr.Code, gin.H{
					"error":   appErr.Message,
					"success": false,
				})
				return
			}

			// Handle other errors (not AppError)
			// Log the error using Gin's error logging.  This is crucial!
			c.Error(err.Err)

			// Determine HTTP status code.  Handle nil err.Err gracefully.
			statusCode := http.StatusInternalServerError
			if err.Err != nil {
				switch {
				case errors.IsBadRequest(err.Err):
					statusCode = http.StatusBadRequest
				case errors.IsNotFound(err.Err):
					statusCode = http.StatusNotFound
				// Add more cases as needed for other error types
				default:
					//If none of the cases matched, still use a meaningful status code.
					statusCode = http.StatusInternalServerError

				}
			} else {
				statusCode = http.StatusInternalServerError // Handle the case where err.Err is nil
			}

			c.JSON(statusCode, gin.H{
				"error":   err.Err, //Use err.Err directly; it will be properly stringified.
				"success": false,
			})
			return
		}
	}
}
