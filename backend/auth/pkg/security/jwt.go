package security

import (
	"auth/config"
	"auth/pkg/errors"
	"auth/pkg/utils"
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type jwtService struct {
}

type JWTService interface {
	GenerateAccessToken(userID string, role string) (string, error)
	GenerateRefreshToken(userID string, role string) (string, string, error)
	ValidateToken(ctx context.Context, token string, tokenType string) (*Claims, error)
}

func NewJWTService() *jwtService {
	return &jwtService{}
}

func (s *jwtService) GenerateAccessToken(userID string, role string) (string, error) {
	cfg := config.GetConfig().JWTConfig

	accessSecretKey := cfg.AccessSecretKey
	accessExpire := time.Duration(cfg.AccessExpire) * time.Minute
	now := time.Now()
	jti, _ := utils.GenerateUUID()

	token, err := generateToken(jwtPayload{
		SecretKey: accessSecretKey,
		Role:      role,
		Issuer:    "auth",
		Subject:   userID,
		ExpiresAt: now.Add(accessExpire),
		IssuedAt:  now,
		JTI:       jti,
	})

	if err != nil {
		return "", err
	}

	return token, nil

}

func (s *jwtService) GenerateRefreshToken(userID string, role string) (string, string, error) {
	cfg := config.GetConfig().JWTConfig

	refreshSecretKey := cfg.RefreshSecretKey
	refreshExpire := time.Duration(cfg.RefreshExpire) * time.Minute
	now := time.Now()
	jti, _ := utils.GenerateUUID()

	token, err := generateToken(jwtPayload{
		SecretKey: refreshSecretKey,
		Role:      role,
		Issuer:    "auth",
		Subject:   userID,
		ExpiresAt: now.Add(refreshExpire),
		IssuedAt:  now,
		JTI:       jti,
	})
	if err != nil {
		return "", "", err
	}

	return token, jti, nil
}

func (s *jwtService) ValidateToken(ctx context.Context, token string, tokenType string) (*Claims, error) {
	cfg := config.GetConfig().JWTConfig

	var secret string
	switch tokenType {
	case "access":
		secret = cfg.AccessSecretKey
	case "refresh":
		secret = cfg.RefreshSecretKey
	default:
		return nil, errors.New("JWT_ERROR", "unknown token type")
	}

	claims := &Claims{}
	parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil || !parsedToken.Valid {
		return nil, errors.New("JWT_INVALID", "invalid token")
	}

	return claims, nil
}
