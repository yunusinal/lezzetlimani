package dto


type VerificationEmailRequest struct {
	To   string `json:"to" binding:"required,email"`
	Code string `json:"code" binding:"required"`
}

type VerificationEmailResponse struct {
	Message string `json:"message"`
}
