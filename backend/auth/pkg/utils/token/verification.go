package token

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateVerificationToken() (string, error) {
	const tokenSize = 64
	b := make([]byte, tokenSize)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	token := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(b)

	return token, nil
}
