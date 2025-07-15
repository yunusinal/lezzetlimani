package utils

import (
	"context"
	"net"
	"net/http"
	"strings"
)

// GetIPFromContext extracts the real client IP from request context
func GetIPFromContext(ctx context.Context) string {
	req, ok := ctx.Value("http-request").(*http.Request)
	if !ok {
		return ""
	}

	return GetIPFromRequest(req)
}

// GetIPFromRequest extracts the IP from headers or remote address
func GetIPFromRequest(r *http.Request) string {
	// Check X-Forwarded-For (if behind reverse proxy)
	ip := r.Header.Get("X-Forwarded-For")
	if ip != "" {
		// May be comma-separated list
		parts := strings.Split(ip, ",")
		return strings.TrimSpace(parts[0])
	}

	// Check X-Real-IP
	ip = r.Header.Get("X-Real-IP")
	if ip != "" {
		return ip
	}

	// Fallback to RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
