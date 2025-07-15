package repository

import (
	"auth/internal/domain"
	"context"
)

type AuthRepository interface {
	Create(ctx context.Context, auth *domain.Auth) error
	GetByAuthID(ctx context.Context, authID string) (*domain.Auth, error)
	GetByUserID(ctx context.Context, userID string) (*domain.Auth, error)
	GetByEmail(ctx context.Context, email string) (*domain.Auth, error)
	IsVerified(ctx context.Context, email string) (bool, error)
	Update(ctx context.Context, auth *domain.Auth) error
	Delete(ctx context.Context, authID string) error
}
