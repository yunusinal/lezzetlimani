package routes

import (
	"auth/internal/handler"
	"auth/internal/infra/redis"
	"auth/internal/middleware"
	"auth/pkg/security"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, authHandler handler.AuthHandler, jwt security.JWTService, redis redis.RedisService) {
	// Public
	auth := r.Group("/auth")
	{
		auth.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "OK"})
		})
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/verify-email", authHandler.VerifyEmail)
		auth.POST("/forgot-password", authHandler.ForgotPassword)
		auth.POST("/reset-password", authHandler.ResetPassword)
	}

	// Protected
	protected := r.Group("/auth")
	protected.Use(middleware.JWTMiddleware(jwt, redis))
	{
		protected.POST("/logout", authHandler.Logout)
	}
}
