package errors

import (
	"fmt"
	"net/http"
)

// AppError represents a custom application error
type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

// Standard error codes
const (
	ErrBadRequest     = http.StatusBadRequest
	ErrUnauthorized   = http.StatusUnauthorized
	ErrForbidden      = http.StatusForbidden
	ErrNotFound       = http.StatusNotFound
	ErrInternalServer = http.StatusInternalServerError
	ErrValidation     = http.StatusUnprocessableEntity
)

// New creates a new AppError
func New(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// BadRequest returns a 400 error
func BadRequest(message string, err error) *AppError {
	return New(ErrBadRequest, message, err)
}

// NotFound returns a 404 error
func NotFound(message string, err error) *AppError {
	return New(ErrNotFound, message, err)
}

// Internal returns a 500 error
func Internal(err error) *AppError {
	return New(ErrInternalServer, "Internal server error", err)
}

// Validation returns a 422 error
func Validation(message string, err error) *AppError {
	return New(ErrValidation, message, err)
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("Error %d: %s - %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

// Helper functions to check error types
func IsBadRequest(err error) bool {
	if appErr, ok := err.(*AppError); ok {
		return appErr.Code == ErrBadRequest
	}
	return false
}

func IsNotFound(err error) bool {
	if appErr, ok := err.(*AppError); ok {
		return appErr.Code == ErrNotFound
	}
	return false
}

func IsUnauthorized(err error) bool {
	if appErr, ok := err.(*AppError); ok {
		return appErr.Code == ErrUnauthorized
	}
	return false
}

func IsForbidden(err error) bool {
	if appErr, ok := err.(*AppError); ok {
		return appErr.Code == ErrForbidden
	}
	return false
}
