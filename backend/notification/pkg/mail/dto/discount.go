package dto

type DiscountEmailRequest struct {
	To          string `json:"to" binding:"required,email"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type DiscountEmailResponse struct {
	Message string `json:"message"`
}
