package repository

import (
	"auth/internal/domain"
	"context"
	"errors"

	"gorm.io/gorm"
)

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) Create(ctx context.Context, auth *domain.Auth) error {
	return r.db.WithContext(ctx).Create(auth).Error
}

func (r *authRepository) GetByAuthID(ctx context.Context, authID string) (*domain.Auth, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("id = ?", authID).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, errors.New("failed to get auth by auth id")
	}
	return &auth, nil
}

func (r *authRepository) GetByUserID(ctx context.Context, userID string) (*domain.Auth, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, errors.New("failed to get auth by user id")
	}
	return &auth, nil
}

func (r *authRepository) GetByEmail(ctx context.Context, email string) (*domain.Auth, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, errors.New("failed to get auth by email")
	}
	return &auth, nil
}

func (r *authRepository) IsVerified(ctx context.Context, email string) (bool, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, errors.New("failed to check if auth is verified")
	}
	return auth.Verified, nil
}

func (r *authRepository) Update(ctx context.Context, auth *domain.Auth) error {
	return r.db.WithContext(ctx).Model(&domain.Auth{}).Where("id = ?", auth.ID).Updates(auth).Error
}

func (r *authRepository) Delete(ctx context.Context, authID string) error {
	return r.db.WithContext(ctx).Delete(&domain.Auth{}).Where("id = ?", authID).Error
}
