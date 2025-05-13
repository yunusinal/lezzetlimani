package repos

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

func (r *authRepository) GetByID(ctx context.Context, id string) (*domain.Auth, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("auth not found")
		}
		return nil, errors.New("failed to get auth")
	}
	return &auth, nil
}

func (r *authRepository) GetByEmail(ctx context.Context, email string) (*domain.Auth, error) {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("auth not found")
		}
		return nil, errors.New("failed to db")
	}
	return &auth, nil
}
func (r *authRepository) UpdatePassword(ctx context.Context, email string, password string) error {
	var auth domain.Auth
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&auth).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("auth not found")
		}
		return errors.New("failed to db")
	}

	result := r.db.WithContext(ctx).Model(&auth).Update("password", password)
	if result.Error != nil {
		return errors.New("failed to update password")
	}
	return nil
}

func (r *authRepository) Delete(ctx context.Context, id string) error {
	err := r.db.WithContext(ctx).Delete(&domain.Auth{}, id).Error
	if err != nil {
		return errors.New("failed to delete auth")
	}
	return nil
}
