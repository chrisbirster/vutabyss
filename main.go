package main

import (
	"context"
	"database/sql"
	"embed"
	"log"

	"github.com/threeroundsoftware/voidabyss/app"
	"github.com/threeroundsoftware/voidabyss/database"
	"github.com/threeroundsoftware/voidabyss/internal/config"
	"github.com/threeroundsoftware/voidabyss/server"

	_ "github.com/mattn/go-sqlite3"
)

const DSN = "vb.db?_foreign_keys=on"

//go:embed dist/*
var staticFiles embed.FS

func main() {
	config, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %s", err.Error())
	}

	db, err := sql.Open("sqlite3", DSN)
	if err != nil {
		log.Fatalf("Failed to connect to SQLite: %v", err)
	}
	defer db.Close()

	err = database.ApplyMigrations(context.Background(), db)
	if err != nil {
		log.Fatalf("Failed to apply migrations: %v", err)
	}

	appInstance := app.NewApp(db)
	server.StartServer(appInstance, staticFiles, config)
}
