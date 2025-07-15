package security

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type jwtPayload struct {
	SecretKey string    `json:"-"`
	Role      string    `json:"role"`
	Issuer    string    `json:"issuer"`
	Subject   string    `json:"subject"`
	ExpiresAt time.Time `json:"expires_at"`
	IssuedAt  time.Time `json:"issued_at"`
	JTI       string    `json:"jti"`
}

type Claims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func generateToken(payload jwtPayload) (string, error) {
	claims := &Claims{
		Role: payload.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    payload.Issuer,
			Subject:   payload.Subject,
			ExpiresAt: jwt.NewNumericDate(payload.ExpiresAt),
			IssuedAt:  jwt.NewNumericDate(payload.IssuedAt),
			ID:        payload.JTI,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(payload.SecretKey))
}
