package server

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
	"golang.org/x/crypto/bcrypt"
)

type Route uint8

const (
	List Route = iota
	Detail
)

// HashPassword hashes a plaintext password using bcrypt.
func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedBytes), nil
}

// ComparePassword compares a plaintext password against a hashed value.
func ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

// requireAuth protects API routes from unauthorized use
func requireAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		log.Printf("starting requireAuth func\n")
		sess, err := session.Get(SESSION, c)
		if err != nil {
			return c.String(http.StatusBadRequest, err.Error())
		}

		log.Printf("session in requireAuth\n: %v\n", sess)
		userID, ok := sess.Values["user_id"].(int64)
		if !ok || userID == 0 {
			log.Printf("bad in requireAuth\n: %v\n%v\n", ok, userID)
			// not logged in
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		}

		log.Printf("session in userID\n: %v\n", userID)
		// user logged in
		return next(c)
	}
}

func convertNullString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func convertNullInt64(ni sql.NullInt64) int64 {
	if ni.Valid {
		return ni.Int64
	}
	return 0
}

func convertNullFloat64(nf sql.NullFloat64) float64 {
	if nf.Valid {
		return nf.Float64
	}
	return 0.0
}

func convertNullTime(nt sql.NullTime) string {
	if nt.Valid {
		return nt.Time.Format(time.RFC3339)
	}
	return ""
}

// findAllPlaceholderNumbers e.g. parse "The capital of {{c1::France::country}} is in Europe. The currency is {{c2::Euro}}."
// returns e.g. [1,2].
func findAllPlaceholderNumbers(text string) []int {
	re := regexp.MustCompile(`\{\{c(\d+)::`)
	matches := re.FindAllStringSubmatch(text, -1)
	var result []int
	for _, m := range matches {
		if len(m) > 1 {
			numStr := m[1]
			n, _ := strconv.Atoi(numStr)
			result = append(result, n)
		}
	}
	return result
}

func uniqueIntSlice(in []int) []int {
	seen := make(map[int]bool)
	out := []int{}
	for _, n := range in {
		if !seen[n] {
			out = append(out, n)
			seen[n] = true
		}
	}
	return out
}

func getUserFromContext(c echo.Context) (database.User, error) {
	user, ok := c.Get("user").(database.User)
	if !ok {
		logging.SlogLogger.Error("Invalid user type in context", "user", user)
		return database.User{}, echo.NewHTTPError(http.StatusUnauthorized, "Invalid user")
	}
	return user, nil
}

func validateRequest(c echo.Context, req interface{}) error {
	if err := c.Bind(req); err != nil {
		logging.SlogLogger.Error("Invalid Request Received", "error", err)
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid request",
		})
	}

	if err := c.Validate(req); err != nil {
		logging.SlogLogger.Error("Invalid Bind Request Validation", "error", err)
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Failed validation",
		})
	}

	return nil
}
