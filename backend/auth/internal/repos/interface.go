package repos

import (
	"auth/internal/domain"
	"context"
)

type AuthRepository interface {
	Create(ctx context.Context, auth *domain.Auth) error
	GetByID(ctx context.Context, id string) (*domain.Auth, error)
	GetByEmail(ctx context.Context, email string) (*domain.Auth, error)
	UpdatePassword(ctx context.Context, email string, password string) error
	Delete(ctx context.Context, id string) error
}
