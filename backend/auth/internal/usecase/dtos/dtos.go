package dtos

// RegisterRequest is the request body for the register endpoint
// @Description RegisterRequest is the request body for the register endpoint
type RegisterRequest struct {
	Username string `json:"username" validate:"required" example:"velanith" description:"Unique username for the user"`
	Email    string `json:"email" validate:"required,email" example:"user@example.com" description:"Valid email address of the user"`
	Password string `json:"password" validate:"required" example:"StrongP@ssw0rd" description:"Password for the account (min 8 characters)"`
}

// RegisterResponse is the response body for the register endpoint
// @Description RegisterResponse is the response body for the register endpoint
type RegisterResponse struct {
	Message string `json:"message" example:"verification sent to email"`
}

// LoginRequest is the request body for the login endpoint
// @Description LoginRequest is the request body for the login endpoint
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email" example:"user@example.com" description:"Valid email address of the user"`
	Password string `json:"password" validate:"required" example:"StrongP@ssw0rd" description:"Password for the account (min 8 characters)"`
}

// LoginResponse is the response body for the login endpoint
// @Description LoginResponse is the response body for the login endpoint
type LoginResponse struct {
	Message string `json:"message" example:"login successful"`
}
