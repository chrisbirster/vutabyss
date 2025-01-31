package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
)

type TeamsResponse struct {
	Teams []database.Team `json:"teams"`
}

func FuncUserTeams(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, ok := c.Get("user").(database.User)
		if !ok {
			log.Printf("Invalid user type in context, %v", user)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
			})
		}
		teams, err := app.Queries.ListTeams(c.Request().Context())
		if err != nil {
			log.Printf("Error getting user's teams : %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to retrieve user's teams",
			})
		}

		response := TeamsResponse{
			Teams: teams,
		}

		return c.JSON(http.StatusOK, response)
	}
}

type CreateTeamRequest struct {
	Name string `json:"name" validate:"required,alphpanumspace,min=4,max=42"`
}

type CreateTeamResponse struct {
	Message string `json:"message"`
}

func FuncCreateTeam(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, ok := c.Get("user").(database.User)
		if !ok {
			log.Printf("Invalid user type in context, %v", user)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
			})
		}

		var req CreateTeamRequest
		if err := c.Bind(&req); err != nil {
			log.Printf("Malformed request data submitted: %v", err)
			return echo.NewHTTPError(http.StatusBadRequest,
				ErrorResponse{
					Error: "Malformed request data submitted.",
				})
		}

		if err := c.Validate(&req); err != nil {
			log.Printf("Create team request failed validation: %v", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Create team request validation failed",
			})
		}

		log.Printf("CreateTeam called with: \nName: %s, \nOwnerID: %s\n ", req.Name, user.ID)
		team, err := app.Queries.CreateTeam(c.Request().Context(), database.CreateTeamParams{
			Name:    req.Name,
			OwnerID: user.ID,
		})
		if err != nil {
			log.Printf("Error creating team : %v", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Unable to create team",
			})
		}

		response := CreateTeamResponse{
			Message: fmt.Sprintf("Team %s successfully created", team.Name),
		}

		return c.JSON(http.StatusOK, response)
	}
}
