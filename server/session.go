package server

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/internal/config"
)

const (
	SESSION            = "voidabyss_session"
	ONE_HOUR           = 3600
	ONE_DAY            = 86400
	MAX_AGE            = 2 * ONE_DAY
	MAX_TOTAL_LIFETIME = 7 * ONE_DAY
)

func CreateSessionStore(config *config.Config) *sessions.CookieStore {
	store := sessions.NewCookieStore([]byte(config.Secret))
	store.Options = &sessions.Options{
		Path:     "/",
		HttpOnly: true,
		MaxAge:   MAX_AGE,
		Secure:   secure(config),
		SameSite: http.SameSiteLaxMode,
	}
	return store
}

func setSessionValues(c echo.Context, userId, email string) error {
	sess, err := session.Get(SESSION, c)
	if err != nil {
		log.Printf("Error saving session after Signup: %s", err.Error())
		return errors.New("Unable to get session")
	}

	now := time.Now().Unix()
	sess.Values["user_id"] = userId
	sess.Values["email"] = email
	sess.Values["created_at"] = now
	sess.Values["updated_at"] = now
	sess.Values["max_age"] = MAX_AGE

	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		log.Printf("Error saving session after Signup: %s", err.Error())
		return errors.New("Error saving session after Signup")
	}
	return nil
}

// Get time in seconds this session is valid without updating
func getMaxAge(sess *sessions.Session) int {
	maxAge := sess.Values["max_age"]

	switch typedMaxAge := maxAge.(type) {
	case int:
		return typedMaxAge
	default:
		return 0
	}
}

// Get a timestamp in seconds of the time the session was created
func getCreatedAt(sess *sessions.Session) int64 {
	createdAt := sess.Values["created_at"]

	switch typedCreatedAt := createdAt.(type) {
	case int64:
		return typedCreatedAt
	default:
		return 0
	}
}

// Get a timestamp in seconds of the last session update
func getUpdatedAt(sess *sessions.Session) int64 {
	lastUpdate := sess.Values["updated_at"]

	switch typedLastUpdate := lastUpdate.(type) {
	case int64:
		return typedLastUpdate
	default:
		return 0
	}
}

func isValidSession(c echo.Context) bool {
	sess, err := session.Get(SESSION, c)
	if err != nil {
		log.Printf("Error retrieving session: %v", err)
		return false
	}

	// Check user_id exists
	userID, ok := sess.Values["user_id"].(string)
	if !ok || userID == "" {
		return false
	}

	// Check timestamps
	createdAt := getCreatedAt(sess)
	updatedAt := getUpdatedAt(sess)
	maxAge := getMaxAge(sess)
	if maxAge == 0 {
		maxAge = MAX_AGE
	}

	now := time.Now().Unix()
	if updatedAt > now {
		// something funky going on
		return false
	}
	if (updatedAt + int64(maxAge)) < now {
		// We exceeded the rolling window
		return false
	}
	if (createdAt + MAX_TOTAL_LIFETIME) < now {
		return false
	}
	return true
}

// clearSession to remove current session
func clearSession(c echo.Context) error {
	sess, err := session.Get(SESSION, c)
	if err != nil {
		return errors.New("Error clearing session")
	}

	delete(sess.Values, "user_id")
	delete(sess.Values, "email")
	delete(sess.Values, "create_at")
	delete(sess.Values, "updated_at")
	sess.Options.MaxAge = -1

	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return errors.New("Error saving session")
	}
	return nil
}

func doRefreshSession(c echo.Context) {
	sess, err := session.Get(SESSION, c)
	if err != nil {
		return
	}

	// If session is already invalid or has no user_id, skip
	userID, ok := sess.Values["user_id"].(string)
	if !ok || userID == "" {
		return
	}

	oldUpdated := getUpdatedAt(sess)
	now := time.Now().Unix()
	if now-oldUpdated < ONE_HOUR {
		// refresh at most once per hour
		return
	}

	sess.Values["updated_at"] = now
	sess.Options.MaxAge = getMaxAge(sess)
	if sess.Options.MaxAge == 0 {
		sess.Options.MaxAge = MAX_AGE
	}

	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		log.Println("failed to refresh session:", err)
	}
}

// SessionMaintenance to enforce session validation and maintenance
func SessionMaintenance(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if !isValidSession(c) {
			log.Printf("Session is invalid")
			return c.Redirect(http.StatusTemporaryRedirect, "/login")
		}
		doRefreshSession(c)
		return next(c)
	}
}

func secure(config *config.Config) bool {
	if config.Mode == "dev" {
		return false
	}
	return true
}
