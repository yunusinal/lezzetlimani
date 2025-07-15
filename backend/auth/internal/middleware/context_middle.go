package middleware

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

type contextKey string

const httpRequestKey contextKey = "http-request"

func RequestContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), httpRequestKey, c.Request)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func GetRequestContext(ctx context.Context) *http.Request {
	req, ok := ctx.Value(httpRequestKey).(*http.Request)
	if !ok {
		return nil
	}
	return req
}
