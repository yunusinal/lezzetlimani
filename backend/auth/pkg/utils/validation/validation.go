package validation

import (
	"errors"
	"regexp"
)

func ValidateEmail(email string) error {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return errors.New("invalid email format")
	}
	return nil
}

var (
	hasDigitRegex   = regexp.MustCompile(`\d`)
	hasLowerRegex   = regexp.MustCompile(`[a-z]`)
	hasUpperRegex   = regexp.MustCompile(`[A-Z]`)
	hasSpecialRegex = regexp.MustCompile(`[@$!%*?&]`)
)

func ValidatePassword(password string) error {
	if !hasDigitRegex.MatchString(password) {
		return errors.New("password must contain at least one digit")
	}

	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	if len(password) > 64 {
		return errors.New("password must be less than 64 characters")
	}

	if !hasLowerRegex.MatchString(password) {
		return errors.New("password must contain at least one lowercase letter")
	}

	if !hasUpperRegex.MatchString(password) {
		return errors.New("password must contain at least one uppercase letter")
	}

	if !hasSpecialRegex.MatchString(password) {
		return errors.New("password must contain at least one special character")
	}

	return nil
}

func ValidateEmailAndPassword(email, password string) error {
	if err := ValidateEmail(email); err != nil {
		return err
	}

	if err := ValidatePassword(password); err != nil {
		return err
	}

	return nil
}
