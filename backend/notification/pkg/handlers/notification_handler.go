package handlers

import (
	"net/http"
	"notification/pkg/mail"
	mailDto "notification/pkg/mail/dto"

	"github.com/gin-gonic/gin"
)

type NotificationRequest struct {
	Type      string            `json:"type" binding:"required"`
	To        string            `json:"to" binding:"required,email"`
	Subject   string            `json:"subject,omitempty"`
	Template  string            `json:"template,omitempty"`
	Variables map[string]string `json:"variables,omitempty"`
}

type NotificationResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func SendNotification(c *gin.Context) {
	var req NotificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	switch req.Type {
	case "verification":
		verificationReq := mailDto.VerificationEmailRequest{
			To:   req.To,
			Code: req.Variables["code"],
		}
		if req.Variables["code"] == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Verification code is required for verification emails",
			})
			return
		}
		
		resp, err := mail.SendEmail(verificationReq)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to send verification email",
				"details": err.Error(),
			})
			return
		}
		
		c.JSON(http.StatusOK, NotificationResponse{
			Message: resp.Message,
			Status:  "success",
		})

	case "password_reset":
		resetReq := mailDto.PasswordResetEmailRequest{
			To:   req.To,
			Code: req.Variables["code"],
		}
		if req.Variables["code"] == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Reset code is required for password reset emails",
			})
			return
		}
		
		resp, err := mail.SendPasswordResetEmail(resetReq)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to send password reset email",
				"details": err.Error(),
			})
			return
		}
		
		c.JSON(http.StatusOK, NotificationResponse{
			Message: resp.Message,
			Status:  "success",
		})

	case "discount":
		discountReq := mailDto.DiscountEmailRequest{
			To:          req.To,
			Title:       req.Variables["title"],
			Description: req.Variables["description"],
		}
		if req.Variables["title"] == "" || req.Variables["description"] == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Title and description are required for discount emails",
			})
			return
		}
		
		resp, err := mail.SendDiscountEmail(discountReq)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to send discount email",
				"details": err.Error(),
			})
			return
		}
		
		c.JSON(http.StatusOK, NotificationResponse{
			Message: resp.Message,
			Status:  "success",
		})

	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unsupported notification type. Supported types: verification, password_reset, discount",
		})
	}
}

func GetNotificationTypes(c *gin.Context) {
	types := []map[string]interface{}{
		{
			"type":        "verification",
			"description": "Email verification for user registration",
			"required_variables": []string{"code"},
		},
		{
			"type":        "password_reset",
			"description": "Password reset email",
			"required_variables": []string{"code"},
		},
		{
			"type":        "discount",
			"description": "Discount/campaign promotional email",
			"required_variables": []string{"title", "description"},
		},
	}
	
	c.JSON(http.StatusOK, gin.H{
		"supported_types": types,
	})
}