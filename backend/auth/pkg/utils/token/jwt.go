package token

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type claim struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func generateToken(payload jwtPayload) (string, error) {
	claims := &claim{
		UserID: payload.UserID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(payload.ExpiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    payload.Issuer,
			Subject:   payload.Subject,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(payload.SecretKey)
}
