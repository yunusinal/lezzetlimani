// Package docs provides Swagger documentation for the Lezzet Limanı Auth Service API
//
// This package contains the auto-generated Swagger documentation for the authentication
// and authorization service of the Lezzet Limanı platform.
//
// The service provides endpoints for:
//   - User registration with email verification
//   - User authentication (login/logout)
//   - JWT token management
//   - Email verification workflow
//   - Health checks
//
// For more information, visit: https://lezzetlimani.site
package docs

import "github.com/swaggo/swag"

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:     "1.0.0",
	Host:        "lezzetlimani.site",
	BasePath:    "/auth",
	Schemes:     []string{"https", "http"},
	Title:       "Lezzet Limanı Auth Service API",
	Description: "Authentication and authorization service for Lezzet Limanı platform",
}

// SwaggerDoc contains the manually created swagger documentation
const SwaggerDoc = `{
  "swagger": "2.0",
  "info": {
    "title": "Lezzet Limanı Auth Service API",
    "description": "Authentication and authorization service for Lezzet Limanı platform",
    "version": "1.0.0",
    "contact": {
      "name": "Lezzet Limanı API Support",
      "email": "support@lezzetlimani.com",
      "url": "https://lezzetlimani.site"
    }
  },
  "host": "lezzetlimani.site",
  "basePath": "/auth",
  "schemes": ["https", "http"],
  "paths": {
    "/health": {
      "get": {
        "tags": ["Health"],
        "summary": "Health check",
        "responses": {
          "200": {
            "description": "Service is healthy"
          }
        }
      }
    },
    "/register": {
      "post": {
        "tags": ["Authentication"],
        "summary": "Register a new user",
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": {
            "type": "object",
            "required": ["email", "password"],
            "properties": {
              "email": {"type": "string", "format": "email"},
              "password": {"type": "string", "minLength": 8}
            }
          }
        }],
        "responses": {
          "201": {"description": "User registered successfully"},
          "400": {"description": "Invalid input"},
          "409": {"description": "User already exists"}
        }
      }
    },
    "/login": {
      "post": {
        "tags": ["Authentication"],
        "summary": "User login",
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": {
            "type": "object",
            "required": ["email", "password"],
            "properties": {
              "email": {"type": "string", "format": "email"},
              "password": {"type": "string"}
            }
          }
        }],
        "responses": {
          "200": {"description": "Login successful"},
          "401": {"description": "Invalid credentials"}
        }
      }
    },
    "/verify-email": {
      "post": {
        "tags": ["Email Verification"],
        "summary": "Verify user email",
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": {
            "type": "object",
            "required": ["token"],
            "properties": {
              "token": {"type": "string"}
            }
          }
        }],
        "responses": {
          "200": {"description": "Email verified successfully"},
          "400": {"description": "Invalid token"}
        }
      }
    },
    "/logout": {
      "post": {
        "tags": ["Authentication"],
        "summary": "User logout",
        "security": [{"BearerAuth": []}],
        "responses": {
          "200": {"description": "Logout successful"},
          "401": {"description": "Unauthorized"}
        }
      }
    }
  },
  "securityDefinitions": {
    "BearerAuth": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  }
}`

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
