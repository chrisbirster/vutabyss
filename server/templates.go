package server

import (
	"bytes"
	"fmt"
	"html/template"
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

// TemplateData represents the data passed to the template
type TemplateData struct {
	Front string
	Back  string
}

// UserFunction represents a function sent from the frontend
type UserFunction struct {
	Name       string `json:"name"`
	OutputType string `json:"outputType"`
	Body       string `json:"body"`
}

// parseCustomFunctions securely registers functions for Go templates
func parseCustomFunctions(userFuncs []UserFunction) (template.FuncMap, error) {
	funcMap := template.FuncMap{}

	for _, fn := range userFuncs {
		switch fn.OutputType {
		case "boolean":
			// Secure evaluation: Only predefined safe logic
			if fn.Body == "return true;" {
				funcMap[fn.Name] = func() bool { return true }
			} else if fn.Body == "return false;" {
				funcMap[fn.Name] = func() bool { return false }
			} else {
				return nil, fmt.Errorf("Invalid function body")
			}
		default:
			return nil, fmt.Errorf("Unsupported function output type")
		}
	}

	return funcMap, nil
}

// Execute the provided Go template and extract generated flashcards
func executeTemplate(tmpl *template.Template, templateName string, data TemplateData) ([]string, error) {
	var output bytes.Buffer
	err := tmpl.ExecuteTemplate(&output, templateName, data)
	if err != nil {
		return nil, err
	}

	// Split output into multiple cards based on div tags
	// Assumes that each card is wrapped in <div></div>
	templates := []string{}
	content := bytes.Split(output.Bytes(), []byte("<div>"))
	for _, rawCard := range content {
		if len(rawCard) > 0 {
			templates = append(templates, "<div>"+string(rawCard))
		}
	}

	return templates, nil
}

type NewTemplateRequest struct {
	TemplateName        string         `json:"template_name"`
	TemplateDescription string         `json:"template_description"`
	TemplateText        string         `json:"template_text"`
	CustomFunctions     []UserFunction `json:"custom_functions"`
	Front               string         `json:"front"`
	Back                string         `json:"back"`
}

// CreateTemplateHandler handles template creation
func FuncCreateTemplateHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}

		var req NewTemplateRequest
		err = validateRequest(c, &req)
		if err != nil {
			logging.SlogLogger.Error("Error validating create deck request", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Failed to validate request",
			})
		}

		// Parse and register user-defined functions
		funcMap, err := parseCustomFunctions(req.CustomFunctions)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to register functions",
			})
		}

		// Register functions and parse template
		tmpl, err := template.New("cardTemplate").Funcs(funcMap).Parse(req.TemplateText)
		if err != nil {
			logging.SlogLogger.Error("Template parsing error", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Invalid template",
			})
		}

		data := TemplateData{
			Front: req.Front,
			Back:  req.Back,
		}

		// Execute the template
		templates, err := executeTemplate(tmpl, data)
		if err != nil {
			logging.SlogLogger.Error("Template execution error", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to render template",
			})
		}

		noteType, err := app.Queries.CreateNoteType(c.Request().Context(), database.CreateNoteTypeParams{
			Name:        req.TemplateName,
			Description: sql.NullString{String: req.TemplateDescription, Valid: true},
			OwnerID:     user.ID,
		})

		cardTemplate, err := app.Queries.CreateCardTemplate(c.Request().Context(), database.CreateCardTemplateParams{
			NoteTypeID:   noteType.ID,
			TemplateName: req.TemplateName,
			FrontHtml:    data.Front,
			BackHtml:     data.Back,
			Css:          sql.NullString{String: "none", Valid: false},
			OwnerID:      user.ID,
		})

		return c.JSON(http.StatusCreated, ErrorResponse{
			Error: "Templates created successfully",
		})
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
