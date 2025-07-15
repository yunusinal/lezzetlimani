package dto

type PasswordResetEmailRequest struct {
	To   string `json:"to" binding:"required,email"`
	Code string `json:"code" binding:"required"`
}

type PasswordResetEmailResponse struct {
	Message string `json:"message"`
}