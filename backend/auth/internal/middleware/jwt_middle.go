package middleware

import (
	"auth/internal/contextkeys"
	"auth/internal/infra/redis"
	"auth/pkg/security"
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTMiddleware(jwt security.JWTService, redis redis.RedisService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    "NO_TOKEN",
				"message": "Authorization header missing or malformed",
			})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := jwt.ValidateToken(c, token, "access")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    "INVALID_TOKEN",
				"message": err.Error(),
			})
			return
		}

		// Redis blacklist check
		isBlacklisted, err := redis.IsTokenBlacklisted(c, claims.ID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"code":    "REDIS_ERROR",
				"message": "Failed to verify token status",
			})
			return
		}
		if isBlacklisted {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    "TOKEN_REVOKED",
				"message": "Token has been revoked",
			})
			return
		}

		// set user info to context
		ctx := context.WithValue(c.Request.Context(), contextkeys.UserIDKey, claims.Subject)
		ctx = context.WithValue(ctx, contextkeys.JTIKey, claims.ID)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
