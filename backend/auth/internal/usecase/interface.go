package usecase

import (
	"auth/internal/usecase/dtos"
	"context"
)

type AuthService interface {
	Register(ctx context.Context, req *dtos.RegisterRequest) (*dtos.RegisterResponse, error)
}
