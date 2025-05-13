package token

import (
	"context"
	"errors"
	"fmt"
	"time"

	"auth/pkg/configs"
	"auth/pkg/redis"

	"github.com/golang-jwt/jwt/v5"
)

type jwtPayload struct {
	UserID    string    `json:"user_id"`
	ExpiresAt time.Time `json:"expires_at"`
	Issuer    string    `json:"issuer"`
	Subject   string    `json:"subject"`
	SecretKey []byte    `json:"secret_key"`
}

type jwtService struct {
	redisClient *redis.RedisClient
}

type JwtService interface {
	GenerateAccessToken(userID string) (string, error)
	GenerateRefreshToken(userID string) (string, error)
	ValidateToken(ctx context.Context, token string) (*claim, error)
}

func NewJwtService(redisClient *redis.RedisClient) JwtService {
	return &jwtService{
		redisClient: redisClient,
	}
}

func (s *jwtService) GenerateAccessToken(userID string) (string, error) {
	cfg := configs.GetConfig()

	accessTokenSecretKey := []byte(cfg.TokenConfig.AccessSecretKey)
	accessTokenExpire := time.Duration(cfg.TokenConfig.AccessExpire) * time.Minute

	return generateToken(jwtPayload{
		UserID:    userID,
		ExpiresAt: time.Now().Add(accessTokenExpire),
		Issuer:    "auth",
		Subject:   "access_token",
		SecretKey: accessTokenSecretKey,
	})
}

func (s *jwtService) GenerateRefreshToken(userID string) (string, error) {
	cfg := configs.GetConfig()

	refreshTokenSecretKey := []byte(cfg.TokenConfig.RefreshSecretKey)
	refreshTokenExpire := time.Duration(cfg.TokenConfig.RefreshExpire) * time.Minute

	return generateToken(jwtPayload{
		UserID:    userID,
		ExpiresAt: time.Now().Add(refreshTokenExpire),
		Issuer:    "auth",
		Subject:   "refresh_token",
		SecretKey: refreshTokenSecretKey,
	})
}

func (s *jwtService) ValidateToken(ctx context.Context, token string) (*claim, error) {
	cfg := configs.GetConfig()

	isBlacklisted, err := s.redisClient.IsTokenBlacklisted(ctx, token)
	if err != nil {
		return nil, err
	}

	if isBlacklisted {
		return nil, errors.New("token is blacklisted")
	}

	parsedToken, err := jwt.ParseWithClaims(token, &claim{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token signing method: %v", token.Header["alg"])
		}

		return []byte(cfg.TokenConfig.AccessSecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := parsedToken.Claims.(*claim); ok && parsedToken.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
