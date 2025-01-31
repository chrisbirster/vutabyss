package app

import (
	"database/sql"
	"github.com/threeroundsoftware/voidabyss/database"
)

type App struct {
	DB      *sql.DB
	Queries *database.Queries
}

// NewApp initializes a new app
func NewApp(db *sql.DB) *App {
	return &App{
		DB:      db,
		Queries: database.New(db),
	}
}
