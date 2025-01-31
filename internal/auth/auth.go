package auth

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// TODO: evaluate against goth service
func NewGoogleConfig() *oauth2.Config {
	GCID := os.Getenv("GOOGLE_CLIENT_ID")
	GCS := os.Getenv("GOOGLE_CLIENT_SECRET")

	config := &oauth2.Config{
		ClientID:     GCID,
		ClientSecret: GCS,
		Scopes:       []string{"user:email"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  google.Endpoint.AuthURL,
			TokenURL: google.Endpoint.TokenURL,
		},
	}

	return config
}
