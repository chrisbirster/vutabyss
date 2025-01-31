package server

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

var (
	regexAlphaNumSpace = regexp.MustCompile("^[ \\p{L}\\p{N}]+$")
	regexPassword      = regexp.MustCompile(`^[A-Za-z\d@$!%*#?&]{8,}$`)
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return err
	}
	return nil
}

func ValidateAlphaNumSpace(fl validator.FieldLevel) bool {
	return regexAlphaNumSpace.MatchString(fl.Field().String())
}

func ValidatePassword(fl validator.FieldLevel) bool {
	input := fl.Field().String()

	if !regexPassword.MatchString(input) {
		return false
	}

	hasLower := regexp.MustCompile(`[a-z]`).MatchString(input)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(input)
	hasDigit := regexp.MustCompile(`\d`).MatchString(input)
	hasSpecial := regexp.MustCompile(`[@$!%*#?&]`).MatchString(input)

	return hasLower && hasUpper && hasDigit && hasSpecial
}

func NewValidator() *CustomValidator {
	val := validator.New(validator.WithRequiredStructEnabled())
	val.RegisterValidation("alphanumspace", ValidateAlphaNumSpace)
	val.RegisterValidation("password", ValidatePassword)
	custom := CustomValidator{
		validator: val,
	}
	return &custom
}
