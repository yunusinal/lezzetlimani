package usecase

import (
	"auth/internal/domain"
	"auth/internal/repos"
	"auth/internal/usecase/dtos"
	"auth/pkg/redis"
	"auth/pkg/utils/generate"
	"auth/pkg/utils/passwd"
	"auth/pkg/utils/token"
	"auth/pkg/utils/validation"
	"context"
	"errors"
	"time"
)

type authService struct {
	authRepo    repos.AuthRepository
	redisClient *redis.RedisClient
}

func NewAuthService(authRepo repos.AuthRepository, redisClient *redis.RedisClient) AuthService {
	return &authService{authRepo: authRepo, redisClient: redisClient}
}

func (s *authService) Register(ctx context.Context, req *dtos.RegisterRequest) (*dtos.RegisterResponse, error) {
	// 1. validate request
	if err := validation.ValidateEmail(req.Email); err != nil {
		return nil, err
	}

	if err := validation.ValidatePassword(req.Password); err != nil {
		return nil, err
	}

	// 2. check if user already exists
	user, err := s.authRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}

	if user != nil {
		return nil, errors.New("user already exists")
	}

	// 3. Hash password
	hashedPassword, err := passwd.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// 4. generate uuid
	uuid, err := generate.NewUUID()
	if err != nil {
		return nil, err
	}

	// 5. generate verification token
	verificationToken, err := token.GenerateVerificationToken()
	if err != nil {
		return nil, err
	}

	// 6. create auth
	auth := &domain.Auth{
		ID:         uuid,
		Email:      req.Email,
		Username:   req.Username,
		Password:   hashedPassword,
		IsVerified: false,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	// 7. save token to redis
	// TODO: add cfg for ttl
	err = s.redisClient.Set(ctx, "verification_token:"+verificationToken, uuid, 10*time.Minute)
	if err != nil {
		return nil, err
	}

	// 8. send kafka message
	// TODO: add kafka message

	// 9. save auth to database
	err = s.authRepo.Create(ctx, auth)
	if err != nil {
		return nil, err
	}

	// 10. return response
	return &dtos.RegisterResponse{Message: "verification sent to " + req.Email}, nil
}
