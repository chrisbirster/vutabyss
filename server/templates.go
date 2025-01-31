package server

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

// TemplateResponse represents the structure of a single template in the API response.
type TemplateResponse struct {
	ID           string    `json:"id"`
	NoteTypeID   string    `json:"note_type_id"`
	TemplateName string    `json:"template_name"`
	FrontHtml    string    `json:"front_html"`
	BackHtml     string    `json:"back_html"`
	Css          string    `json:"css"`
	OwnerID      string    `json:"owner_id"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// TemplatesListResponse encapsulates a list of TemplateResponse.
type TemplatesListResponse struct {
	Templates []TemplateResponse `json:"templates"`
}

// GetTemplatesHandler handles the retrieval of card templates for a user.
func FuncGetTemplatesHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract user from context
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}
		// Fetch templates from database
		templates, err := app.Queries.ListCardTemplatesByOwner(c.Request().Context(), user.ID)
		if err != nil {
			logging.SlogLogger.Error("Error retreiving card templates", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve tamplates",
			})
		}

		// convert to response
		responseTemplates := convertTemplatesToResponse(templates)
		response := TemplatesListResponse{
			Templates: responseTemplates,
		}

		return c.JSON(http.StatusOK, response)
	}
}

// GetTemplateDetailRequest defines the structure for route parameters with validation
type GetTemplateDetailRequest struct {
	ID string `param:"templateID" validate:"required,alphanum,len=10"`
}

// TemplateDetailResponse defines the structure of the JSON response for one template
type TemplateDetailResponse struct {
	Template TemplateResponse `json:"template"`
}

// GetTemplateHandler handles the retrieval of card templates for a user.
func FuncGetTemplateHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract user from context
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}

		// get and validate templateID from request
		var req GetTemplateDetailRequest
		err = validateRequest(c, &req)
		if err != nil {
			logging.SlogLogger.Error("Error validating template request", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Failed to validate tamplate request",
			})
		}

		// Fetch template from database
		template, err := app.Queries.GetCardTemplate(c.Request().Context(), req.ID)
		if err != nil {
			logging.SlogLogger.Error("Error retreiving card template", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve tamplate",
			})
		}

		// verify ownership
		if template.OwnerID != user.ID {
			logging.SlogLogger.Error("Unauthorized access to template", "user", user, "template", template)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve tamplate",
			})
		}

		// convert to response
		responseTemplate := convertTemplateToResponse(template, Detail)
		response := TemplateDetailResponse{
			Template: responseTemplate,
		}

		return c.JSON(http.StatusOK, response)
	}
}

// convertTemplatesToResponse converts a slice of database.CardTemplate to a slice of TemplateResponse.
func convertTemplatesToResponse(templates []database.CardTemplate) []TemplateResponse {
	responseTemplates := make([]TemplateResponse, 0, len(templates))
	for _, template := range templates {
		responseTemplates = append(responseTemplates, convertTemplateToResponse(template, List))
	}
	return responseTemplates
}

// convertTemplateToResponse converts a database.CardTemplate to a TemplateResponse.
// It gracefully handles nullable fields.
func convertTemplateToResponse(template database.CardTemplate, route Route) TemplateResponse {
	css := ""
	if template.Css.Valid {
		css = template.Css.String
	}

	if route == List {
		return TemplateResponse{
			ID:           template.ID,
			TemplateName: template.TemplateName,
			CreatedAt:    template.CreatedAt,
			UpdatedAt:    template.UpdatedAt,
		}
	}

	return TemplateResponse{
		ID:           template.ID,
		NoteTypeID:   template.NoteTypeID,
		TemplateName: template.TemplateName,
		FrontHtml:    template.FrontHtml,
		BackHtml:     template.BackHtml,
		Css:          css,
		OwnerID:      template.OwnerID,
		CreatedAt:    template.CreatedAt,
		UpdatedAt:    template.UpdatedAt,
	}
}
