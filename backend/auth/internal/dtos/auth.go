package dtos

// RegisterRequest is the request for the register endpoint
// @Description RegisterRequest is the request for the register endpoint
type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// RegisterResponse is the response for the register endpoint
// @Description RegisterResponse is the response for the register endpoint
type RegisterResponse struct {
	Message string `json:"message"`
	Token   string `json:"token"`
}

// LoginRequest is the request for the login endpoint
// @Description LoginRequest is the request for the login endpoint
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// LoginResponse is the response for the login endpoint
// @Description LoginResponse is the response for the login endpoint
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Token        string `json:"token"`
}

// LogoutRequest is the request for the logout endpoint
// @Description LogoutRequest is the request for the logout endpoint
type LogoutRequest struct {
	Message string `json:"message"`
}

// LogoutResponse is the response for the logout endpoint
// @Description LogoutResponse is the response for the logout endpoint
type LogoutResponse struct {
	Message string `json:"message"`
}

// VerifyEmailRequest is the request for the verify email endpoint
// @Description VerifyEmailRequest is the request for the verify email endpoint
type VerifyEmailRequest struct {
	Token string `json:"token" validate:"required"`
}

// VerifyEmailResponse is the response for the verify email endpoint
// @Description VerifyEmailResponse is the response for the verify email endpoint
type VerifyEmailResponse struct {
	Message      string `json:"message"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Token        string `json:"token"`
}

// @Description ForgotPasswordRequest is the request for the forgot password endpoint
type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// ForgotPasswordResponse is the response for the forgot password endpoint
// @Description ForgotPasswordResponse is the response for the forgot password endpoint
type ForgotPasswordResponse struct {
	Message string `json:"message"`
}

// @Description ResetPasswordRequest is the request for the reset password endpoint
type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"password" validate:"required,min=8"`
}

// ResetPasswordResponse is the response for the reset password endpoint
// @Description ResetPasswordResponse is the response for the reset password endpoint
type ResetPasswordResponse struct {
	Message string `json:"message"`
}
