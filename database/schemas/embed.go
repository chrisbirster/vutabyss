package schemas

import "embed"

//go:embed *.sql
var MigrationFiles embed.FS
