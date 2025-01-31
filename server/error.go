package server

import (
	"errors"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

var (
	ErrSessionInvalid   = errors.New("Error session invalid")
	ErrMalformedSession = errors.New("Error malformed session")
	ErrUserNotExist     = errors.New("Error user does not exist")
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func CustomHTTPErrorHandler(err error, c echo.Context) {
	var (
		code    = http.StatusInternalServerError
		message = "Internal server error"
	)

	switch {
	case errors.Is(err, ErrSessionInvalid):
		code = http.StatusInternalServerError
		message = "Internal server error"
	case errors.Is(err, ErrMalformedSession), errors.Is(err, ErrUserNotExist):
		code = http.StatusUnauthorized
		message = "Unauthorized: Invalid session or user"
	default:
		log.Printf("Unhandled error: %v", err)
	}

	if !c.Response().Committed {
		c.JSON(code, ErrorResponse{Error: message})
	}
}
