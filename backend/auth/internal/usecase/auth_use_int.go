package usecase

import (
	"auth/internal/dtos"
	"context"
)

type AuthUsecase interface {
	Register(ctx context.Context, req *dtos.RegisterRequest) (*dtos.RegisterResponse, error)
	Login(ctx context.Context, req *dtos.LoginRequest) (*dtos.LoginResponse, error)
	VerifyEmail(ctx context.Context, req *dtos.VerifyEmailRequest) (*dtos.VerifyEmailResponse, error)
	ForgotPassword(ctx context.Context, req *dtos.ForgotPasswordRequest) (*dtos.ForgotPasswordResponse, error)
	ResetPassword(ctx context.Context, req *dtos.ResetPasswordRequest) (*dtos.ResetPasswordResponse, error)
	Logout(ctx context.Context, req *dtos.LogoutRequest) (*dtos.LogoutResponse, error)
}
