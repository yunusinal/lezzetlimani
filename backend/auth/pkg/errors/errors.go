package errors

import (
	"errors"
	"fmt"
)

type AppError struct {
	Err     error
	Message string
	Code    string
}

func (e *AppError) Error() string {
	return fmt.Sprintf("message: %s, code: %s, error: %v", e.Message, e.Code, e.Err)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func New(code, message string) *AppError {
	return &AppError{
		Message: message,
		Code:    code,
	}
}

func Wrap(err error, code, message string) *AppError {
	return &AppError{
		Err:     err,
		Message: message,
		Code:    code,
	}
}

func IsAppError(err error, code string) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Code == code
	}
	return false
}
