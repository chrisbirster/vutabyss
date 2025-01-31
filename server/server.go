package server

import (
	"embed"
	"fmt"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/facebook"
	"github.com/markbates/goth/providers/google"

	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/internal/config"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

func StartServer(appInstance *app.App, staticFiles embed.FS, config *config.Config) {

	goth.UseProviders(
		google.New(
			config.GoogleClientID,
			config.GoogleClientSecret,
			config.GoogleClientCallback,
			"email", "profile",
		),
		facebook.New(
			config.FacebookClientID,
			config.FacebookClientSecret,
			config.FacebookClientCallback,
			"email", "public_profile",
		),
	)

	e := echo.New()
	e.Validator = NewValidator()
	e.HTTPErrorHandler = CustomHTTPErrorHandler

	// --- Middleware ---
	e.Use(logging.Logger())
	e.Use(middleware.Recover())
	e.Use(session.Middleware(CreateSessionStore(config)))
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  "dist",
		HTML5: true,
	}))

	// --- Security Enhancements ---
	if config.Mode != "dev" {
		e.Use(middleware.HTTPSRedirect())
		e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
			XSSProtection:      "1; mode=block",
			ContentTypeNosniff: "nosniff",
			HSTSMaxAge:         31536000, // 1 year
		}))
		e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
			TokenLookup:    "header:X-CSRF-Token",
			CookieName:     "csrf_token",
			CookieMaxAge:   3600,
			CookieHTTPOnly: true,
		}))
	}

	// --- Auth routes ---
	auth := e.Group("/auth")
	auth.GET("/:provider", FuncBeginLogin())
	auth.GET("/:provider/callback", FuncLoginCallback(appInstance))
	auth.POST("/signup", FuncSignUp(appInstance))
	auth.POST("/login", FuncLogin(appInstance))
	auth.POST("/logout", FuncLogout())

	// --- API routes ---
	api := e.Group("/api", SessionMaintenance)
	api.Use(AuthMiddleware(appInstance))
	api.GET("/", FuncVBIndex())
	api.GET("/me", FuncMe())
	api.GET("/decks", FuncGetDecksHandler(appInstance))
	api.POST("/decks", FuncCreateDeckHandler(appInstance))
	api.GET("/decks/:deckID/cards", FuncUserCardsByDeck(appInstance))
	api.GET("/resource", FuncUserResources(appInstance))
	api.GET("/teams", FuncUserTeams(appInstance))
	api.GET("/templates", FuncGetTemplatesHandler(appInstance))
	api.GET("/templates/:templateID", FuncGetTemplateHandler(appInstance))
	api.POST("/teams", FuncCreateTeam(appInstance))

	// start app
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", config.Port)))
}
