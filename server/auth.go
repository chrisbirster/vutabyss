package server

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth/gothic"

	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
)

// AuthMiddleware ensures that the user is authenticated and injects the user into the context
func AuthMiddleware(app *app.App) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			sess, err := session.Get(SESSION, c)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error: "Unauthorized: invalid session",
				})
			}

			userId, ok := sess.Values["user_id"].(string)
			if !ok || userId == "" {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error: "Unauthorized: user not logged in",
				})
			}

			user, err := app.Queries.GetUser(c.Request().Context(),
				userId)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error: "Unauthorized: user does not exist",
				})
			}
			c.Set("user", user)

			return next(c)
		}
	}

}

// FuncBeginLogin handles google auth
func FuncBeginLogin() echo.HandlerFunc {
	return func(c echo.Context) error {
		gothic.GetProviderName = func(req *http.Request) (string, error) {
			provider := c.Param("provider")
			if provider != "" {
				return provider, nil
			}
			return "", c.String(http.StatusBadRequest, "unable to get provider")
		}

		gothic.BeginAuthHandler(c.Response().Writer, c.Request())
		return nil
	}
}

// FuncLoginCallback handles google auth
func FuncLoginCallback(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, err := gothic.CompleteUserAuth(c.Response().Writer, c.Request())
		if err != nil {
			return c.String(http.StatusUnauthorized, err.Error())
		}
		log.Printf("User from oauth callback: %+v\n", user)

		displayName := strings.Split(user.Email, "@")[0]
		log.Printf("Creating user: %v\n", displayName)

		dbUser, err := app.Queries.CreateUser(c.Request().Context(),
			database.CreateUserParams{
				Email:        user.Email,
				PasswordHash: sql.NullString{},
				DisplayName: sql.NullString{
					String: displayName,
					Valid:  true,
				},
			},
		)

		if err != nil {
			log.Printf("Error creating user: %v", err)
			return echo.NewHTTPError(http.StatusConflict, "Error: user already exists")
		}

		err = setSessionValues(c, dbUser.ID, user.Email)
		if err != nil {
			log.Printf("Error saving session: %v", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "Error: Unable to save session")
		}
		return c.Redirect(http.StatusTemporaryRedirect, "/app")
	}
}

type APILoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=30,password"`
}

type APILoginResponse struct {
	UserId  string `json:"user_id"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func FuncLogin(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req APILoginRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Malformed request data submitted: %v", err)
			return echo.NewHTTPError(http.StatusBadRequest,
				ErrorResponse{
					Error: "Malformed request data submitted.",
				})
		}

		if err := c.Validate(&req); err != nil {
			log.Printf("Login request failed validation: %v", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Login request validation failed",
			})
		}

		user, err := app.Queries.GetUserByEmail(c.Request().Context(), req.Email)
		log.Printf("User returned from GetUserByEmail: %v", user)
		if err != nil {
			log.Printf("Error no user is associated with this email: %v", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "No user account is associated with this email.",
			})
		}

		err = ComparePassword(user.PasswordHash.String, req.Password)
		if err != nil {
			log.Printf("Invalid password provided for %s: %s", req.Email, err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Invalid password provided",
			})
		}
		err = setSessionValues(c, user.ID, user.Email)
		if err != nil {
			log.Printf("Error: unable to save session: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to save session",
			})
		}
		response := APILoginResponse{
			UserId:  user.ID,
			Email:   user.Email,
			Message: fmt.Sprintln("Login successful"),
		}

		return c.JSON(http.StatusOK, response)
	}
}

type APISignUpRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=30,password"`
}

type APISignUpResponse struct {
	UserId  string `json:"user_id"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func FuncSignUp(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		var signUpRequest APISignUpRequest
		if err := c.Bind(&signUpRequest); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "invalid request",
			})
		}

		if err := c.Validate(&signUpRequest); err != nil {
			log.Printf("Signup request failed validation: %v", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Signup request validation failed",
			})
		}
		tx, err := app.DB.BeginTx(c.Request().Context(), nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal Server Error",
			})
		}
		defer tx.Rollback()
		qtx := app.Queries.WithTx(tx)

		user, err := CreateNewUser(c.Request().Context(), qtx, signUpRequest)
		if (err) != nil {
			log.Printf("Failed to create new user: %v", err)
			tx.Rollback()
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Not able to onboard new user",
			})
		}

		displayName := convertNullString(user.DisplayName)
		err = OnboardNewUser(c.Request().Context(), qtx, user.ID, displayName)
		if err != nil {
			log.Printf("Error onboarding user: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Error onboarding new user"})
		}
		tx.Commit()

		err = setSessionValues(c, user.ID, signUpRequest.Email)
		if err != nil {
			log.Printf("error saving session: %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
			})
		}

		response := APISignUpResponse{
			UserId:  user.ID,
			Email:   user.Email,
			Message: fmt.Sprintf("Signup Successful"),
		}

		return c.JSON(http.StatusOK, response)
	}
}

// FuncLogout kills the session and returns a simple JSON response.
func FuncLogout() echo.HandlerFunc {
	return func(c echo.Context) error {
		if err := clearSession(c); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to get session",
			})
		}

		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}
}
