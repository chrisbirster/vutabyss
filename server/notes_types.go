package server

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/logging"
)

// NoteTypeResponse represents the structure of a single note type in the API response.
type NoteTypeResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerID     string    `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// NoteTypesListResponse encapsulates a list of TemplateResponse.
type NoteTypesListResponse struct {
	NoteTypes []NoteTypeResponse `json:"note_types"`
}

// GetTemplatesHandler handles the retrieval of card templates for a user.
func FuncGetNoteTypesHandler(app *app.App) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Extract user from context
		user, err := getUserFromContext(c)
		if err != nil {
			logging.SlogLogger.Error("Unauthorized access attempt", "error", err)
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Unauthorized",
			})
		}
		// Fetch note types from database
		note_types, err := app.Queries.ListNoteTypesByOwner(c.Request().Context(), user.ID)
		if err != nil {
			logging.SlogLogger.Error("Error retreiving note types", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve note types",
			})
		}

		// convert to response
		responseNoteTypes := convertNoteTypesToResponse(note_types)
		response := NoteTypesListResponse{
			NoteTypes: responseNoteTypes,
		}

		return c.JSON(http.StatusOK, response)
	}
}

// GetNoteTypeDetailRequest defines the structure for route parameters with validation
type GetNoteTypeDetailRequest struct {
	ID string `param:"noteTypeID" validate:"required,alphanum,len=10"`
}

// NoteTypeDetailResponse defines the structure of the JSON response for one template
type NoteTypeDetailResponse struct {
	NoteType NoteTypeResponse `json:"note_type"`
}

// FuncGetNoteTypeHandler handles the retrieval of a note type for a user.
func FuncGetNoteTypeHandler(app *app.App) echo.HandlerFunc {
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
		var req GetNoteTypeDetailRequest
		err = validateRequest(c, &req)
		if err != nil {
			logging.SlogLogger.Error("Error validating note type request", "error", err)
			return c.JSON(http.StatusBadRequest, ErrorResponse{
				Error: "Failed to validate note type request",
			})
		}

		// Fetch note type from database
		noteType, err := app.Queries.GetNoteType(c.Request().Context(), req.ID)
		if err != nil {
			logging.SlogLogger.Error("Error retreiving note type", "error", err)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve note type",
			})
		}

		// verify ownership
		if noteType.OwnerID != user.ID {
			logging.SlogLogger.Error("Unauthorized access to note type", "user", user, "note type", noteType)
			return c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Failed to retrieve note type",
			})
		}

		// convert to response
		responseNoteType := convertNoteTypeToResponse(noteType, Detail)
		response := NoteTypeDetailResponse{
			NoteType: responseNoteType,
		}

		return c.JSON(http.StatusOK, response)
	}
}

// convertNoteTypesToResponse converts a slice of database.NoteType to a slice of NoteTypeListResponse.
func convertNoteTypesToResponse(noteTypes []database.NoteType) []NoteTypeResponse {
	responseNoteTypes := make([]NoteTypeResponse, 0, len(noteTypes))
	for _, noteType := range noteTypes {
		responseNoteTypes = append(responseNoteTypes, convertNoteTypeToResponse(noteType, List))
	}
	return responseNoteTypes
}

// convertNoteTypeToResponse converts a database.NoteType to a NoteTypeListResponse.
// It gracefully handles nullable fields.
func convertNoteTypeToResponse(nt database.NoteType, route Route) NoteTypeResponse {
	description := ""
	if nt.Description.Valid {
		description = nt.Description.String
	}

	if route == List {
		return NoteTypeResponse{
			ID:          nt.ID,
			Name:        nt.Name,
			Description: description,
			CreatedAt:   nt.CreatedAt,
			UpdatedAt:   nt.UpdatedAt,
		}
	}

	return NoteTypeResponse{
		ID:          nt.ID,
		Name:        nt.Name,
		Description: description,
		OwnerID:     nt.OwnerID,
		CreatedAt:   nt.CreatedAt,
		UpdatedAt:   nt.UpdatedAt,
	}
}
