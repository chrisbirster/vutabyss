package config

import (
	"errors"
	"os"
)

var (
	ErrMissingGoogleClientID         = errors.New("missing required env var: GOOGLE_CLIENT_ID")
	ErrMissingGoogleClientSecret     = errors.New("missing required env var: GOOGLE_CLIENT_SECRET")
	ErrMissingGoogleClientCallback   = errors.New("missing required env var: SESSION_SECRET")
	ErrMissingFacebookClientID       = errors.New("missing required env var: GOOGLE_CLIENT_ID")
	ErrMissingFacebookClientSecret   = errors.New("missing required env var: GOOGLE_CLIENT_SECRET")
	ErrMissingFacebookClientCallback = errors.New("missing required env var: SESSION_SECRET")
	ErrMissingSessionSecret          = errors.New("missing required env var: SESSION_SECRET")
	ErrMissingMode                   = errors.New("missing required env var: MODE")
	ErrMissingPort                   = errors.New("missing required env var: PORT")
	ErrMissingDSN                    = errors.New("missing required env var: DSN")
)

type Config struct {
	GoogleClientID         string
	GoogleClientSecret     string
	GoogleClientCallback   string
	FacebookClientID       string
	FacebookClientSecret   string
	FacebookClientCallback string
	Secret                 string
	Mode                   string
	Port                   string
	DSN                    string
}

func Load() (*Config, error) {
	cfg := &Config{
		GoogleClientID:         os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret:     os.Getenv("GOOGLE_CLIENT_SECRET"),
		GoogleClientCallback:   os.Getenv("GOOGLE_CALLBACK"),
		FacebookClientID:       os.Getenv("FACEBOOK_CLIENT_ID"),
		FacebookClientSecret:   os.Getenv("FACEBOOK_CLIENT_SECRET"),
		FacebookClientCallback: os.Getenv("FACEBOOK_CALLBACK"),
		Secret:                 os.Getenv("SESSION_SECRET"),
		Mode:                   os.Getenv("MODE"),
		Port:                   os.Getenv("PORT"),
		DSN:                    os.Getenv("DSN"),
	}

	if cfg.GoogleClientID == "" {
		return nil, ErrMissingGoogleClientID
	}
	if cfg.GoogleClientSecret == "" {
		return nil, ErrMissingGoogleClientSecret
	}
	if cfg.GoogleClientCallback == "" {
		return nil, ErrMissingGoogleClientCallback
	}
	if cfg.FacebookClientID == "" {
		return nil, ErrMissingFacebookClientID
	}
	if cfg.FacebookClientSecret == "" {
		return nil, ErrMissingFacebookClientSecret
	}
	if cfg.FacebookClientCallback == "" {
		return nil, ErrMissingFacebookClientCallback
	}
	if cfg.Secret == "" {
		return nil, ErrMissingSessionSecret
	}
	if cfg.Mode == "" {
		return nil, ErrMissingMode
	}
	if cfg.Port == "" {
		return nil, ErrMissingPort
	}
	if cfg.DSN == "" {
		return nil, ErrMissingDSN
	}

	return cfg, nil
}
