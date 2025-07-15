package handler

import (
	"auth/internal/contextkeys"
	"auth/internal/dtos"
	"auth/internal/usecase"
	"auth/pkg/errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type authHandler struct {
	authUsecase usecase.AuthUsecase
}

func NewAuthHandler(authUsecase usecase.AuthUsecase) AuthHandler {
	return &authHandler{authUsecase: authUsecase}
}

// Register user
// @Summary Register a new user
// @Description Register a new user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param user body RegisterRequest true "User registration data"
// @Success 201 {object} map[string]string "User registered successfully"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /register [post]
func (h *authHandler) Register(c *gin.Context) {
	var req dtos.RegisterRequest

	// JSON bind error
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Code:    "INVALID_PAYLOAD",
			Message: "Invalid request payload",
		})
		return
	}

	res, err := h.authUsecase.Register(c.Request.Context(), &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			switch appErr.Code {
			case "USER_ALREADY_EXISTS":
				c.JSON(http.StatusConflict, dtos.ErrorResponse{
					Code:    appErr.Code,
					Message: appErr.Message,
				})
				return

			case "REDIS_ERROR", "REDIS_SET":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
					Code:    appErr.Code,
					Message: "Temporary Redis issue. Please try again later.",
				})
				return

			case "KAFKA_ERROR":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
					Code:    appErr.Code,
					Message: "Failed to send verification email. Please try again.",
				})
				return
			}

			c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
				Code:    appErr.Code,
				Message: appErr.Message,
			})
			return
		}

		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "An unexpected error occurred",
		})
		return
	}

	c.JSON(http.StatusCreated, res)
}

// Login user
// @Summary User login
// @Description Authenticate user and return JWT tokens
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body LoginRequest true "User login credentials"
// @Success 200 {object} LoginResponse "Login successful with tokens"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Router /login [post]
func (h *authHandler) Login(c *gin.Context) {
	var req dtos.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Code:    "INVALID_PAYLOAD",
			Message: "Invalid request format",
		})
		return
	}

	res, err := h.authUsecase.Login(c.Request.Context(), &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			switch appErr.Code {
			case "INVALID_CREDENTIALS":
				c.JSON(http.StatusUnauthorized, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "EMAIL_NOT_VERIFIED":
				c.JSON(http.StatusForbidden, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "REDIS_ERROR", "JWT_ERROR":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: "Temporary login issue. Please try again."})
			default:
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			}
			return
		}

		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "Unexpected error",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Verify email
// @Summary Verify user email
// @Description Verify user email with verification token
// @Tags auth
// @Accept json
// @Produce json
// @Param verification body VerifyEmailRequest true "Email verification data"
// @Success 200 {object} map[string]string "Email verified successfully"
// @Failure 400 {object} map[string]string "Bad request"
// @Router /verify-email [post]
func (h *authHandler) VerifyEmail(c *gin.Context) {
	var req dtos.VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Code:    "INVALID_PAYLOAD",
			Message: "Invalid request format",
		})
		return
	}

	res, err := h.authUsecase.VerifyEmail(c.Request.Context(), &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			switch appErr.Code {
			case "INVALID_TOKEN":
				c.JSON(http.StatusUnauthorized, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "ALREADY_VERIFIED":
				c.JSON(http.StatusForbidden, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "REDIS_ERROR", "DB_ERROR", "JWT_ERROR":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: "Internal server error"})
			default:
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			}
			return
		}

		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "Unexpected error",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Get user profile
// @Summary Get user profile
// @Description Get authenticated user's profile information
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} UserResponse "User profile"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Router /me [get]
func (h *authHandler) GetProfile(c *gin.Context) {
	// ... mevcut kod ...
}

// Refresh token
// @Summary Refresh JWT token
// @Description Get new access token using refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param token body RefreshTokenRequest true "Refresh token"
// @Success 200 {object} TokenResponse "New tokens"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Router /refresh-token [post]
func (h *authHandler) RefreshToken(c *gin.Context) {
	// ... mevcut kod ...
}

// Logout user
// @Summary User logout
// @Description Logout user and invalidate tokens
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]string "Logout successful"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Router /logout [post]
func (h *authHandler) Logout(c *gin.Context) {
	var req dtos.LogoutRequest

	ctx := c.Request.Context()
	userID, ok := ctx.Value(contextkeys.UserIDKey).(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, dtos.ErrorResponse{
			Code:    "INVALID_CONTEXT",
			Message: "Missing userID in context",
		})
		return
	}

	jti, ok := ctx.Value(contextkeys.JTIKey).(string)
	if !ok || jti == "" {
		c.JSON(http.StatusUnauthorized, dtos.ErrorResponse{
			Code:    "INVALID_CONTEXT",
			Message: "Missing jti in context",
		})
		return
	}

	res, err := h.authUsecase.Logout(ctx, &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
				Code:    appErr.Code,
				Message: appErr.Message,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "Unexpected error",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Forgot password
// @Summary Forgot password
// @Description Send a password reset email
// @Tags auth
// @Accept json
// @Produce json
// @Param email body ForgotPasswordRequest true "User email for password reset"
// @Success 200 {object} ForgotPasswordResponse "Password reset email sent"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 404 {object} map[string]string "User not found"
// @Router /forgot-password [post]
func (h *authHandler) ForgotPassword(c *gin.Context) {
	var req dtos.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Code:    "INVALID_PAYLOAD",
			Message: "Invalid request payload",
		})
		return
	}

	res, err := h.authUsecase.ForgotPassword(c.Request.Context(), &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			switch appErr.Code {
			case "USER_NOT_FOUND":
				c.JSON(http.StatusNotFound, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "REDIS_ERROR", "KAFKA_ERROR":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			default:
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			}
			return
		}
		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: "INTERNAL_ERROR", Message: "Unexpected error"})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Reset password
// @Summary Reset password
// @Description Reset user password using a token
// @Tags auth
// @Accept json
// @Produce json
// @Param reset body ResetPasswordRequest true "Reset password data"
// @Success 200 {object} ResetPasswordResponse "Password reset successful"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 404 {object} map[string]string "User not found or invalid token"
// @Router /reset-password [post]
func (h *authHandler) ResetPassword(c *gin.Context) {
	var req dtos.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Code:    "INVALID_PAYLOAD",
			Message: "Invalid request payload",
		})
		return
	}

	res, err := h.authUsecase.ResetPassword(c.Request.Context(), &req)
	if err != nil {
		if appErr, ok := err.(*errors.AppError); ok {
			switch appErr.Code {
			case "INVALID_TOKEN":
				c.JSON(http.StatusBadRequest, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "USER_NOT_FOUND":
				c.JSON(http.StatusNotFound, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			case "HASH_ERROR", "DB_ERROR":
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			default:
				c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: appErr.Code, Message: appErr.Message})
			}
			return
		}
		c.JSON(http.StatusInternalServerError, dtos.ErrorResponse{Code: "INTERNAL_ERROR", Message: "Unexpected error"})
		return
	}

	c.JSON(http.StatusOK, res)
}
