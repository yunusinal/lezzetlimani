package handler

import "github.com/gin-gonic/gin"

type AuthHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	VerifyEmail(c *gin.Context)
	ForgotPassword(c *gin.Context)
	ResetPassword(c *gin.Context)
	Logout(c *gin.Context)
}
