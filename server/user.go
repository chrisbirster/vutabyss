package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type APIMeResponse struct {
	UserId string `json:"user_id"`
	Email  string `json:"email"`
}

// FuncMe gets the user's personal data
func FuncMe() echo.HandlerFunc {
	return func(c echo.Context) error {
		user, ok := c.Get("user").(database.User)
		if !ok {
			log.Printf("Failed to get user: %v", user)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve user from context",
			})
		}
		log.Printf("user from context: %v\n", user)
		response := APIMeResponse{
			UserId: user.ID,
			Email:  user.Email,
		}

		return c.JSON(http.StatusOK, response)
	}

}

func CreateNewUser(ctx context.Context, q *database.Queries, req APISignUpRequest) (*database.User, error) {
	hashedPW, err := HashPassword(req.Password)
	if err != nil {
		log.Printf("Unable to hash password: %v", err)
		return nil, errors.New("internal server error")
	}

	displayName := strings.Split(req.Email, "@")[0]

	log.Printf("creating user: %v\n", displayName)

	user, err := q.CreateUser(ctx,
		database.CreateUserParams{
			Email: req.Email,
			PasswordHash: sql.NullString{
				String: hashedPW,
				Valid:  true,
			},
			DisplayName: sql.NullString{
				String: displayName,
				Valid:  true,
			},
		},
	)
	if err != nil {
		log.Printf("error creating user: %v", err)
		return nil, errors.New("Error creating uer")
	}
	return &user, nil
}

func GenerateUserTeamAndSettings(ctx context.Context, q *database.Queries, userID string, displayName string) error {

	team, err := q.CreateTeam(ctx, database.CreateTeamParams{
		Name:    fmt.Sprintf("%s's Team", cases.Title(language.English).String(displayName)),
		OwnerID: userID,
	})
	if err != nil {
		logging.SlogLogger.Error("Unable to create team", "error", err)
		return err
	}
	log.Printf("team %v has been created for user %s", team, userID)

	teamMember, err := q.AddTeamMember(ctx, database.AddTeamMemberParams{TeamID: team.ID, UserID: userID, Role: "owner"})
	if err != nil {
		logging.SlogLogger.Error("Unable to create team member", "error", err)
		return err
	}

	log.Printf("team_member %s has been added to team: %s", teamMember.UserID, team.Name)

	userSetting, err := q.CreateUserSetting(ctx, database.CreateUserSettingParams{
		UserID:               userID,
		Theme:                sql.NullString{String: "lightTheme", Valid: true},
		DailyNewCardsLimit:   10,
		NotificationsEnabled: false,
		TutorialEnabled:      true,
	})
	if err != nil {
		log.Printf("Unable to create team member, %v", err)
		return err
	}
	log.Printf("User %s settings have been updated: %v\n", userID, userSetting)

	return nil
}
