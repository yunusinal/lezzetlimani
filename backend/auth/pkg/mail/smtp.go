package mail

import (
	"auth/config"
	"fmt"
	"net/smtp"
)

type VerificationEmailRequest struct {
	To   string
	Code string
}

func SendVerificationEmail(req VerificationEmailRequest) error {
	cfg := config.GetConfig().EmailConfig

	auth := smtp.PlainAuth("", cfg.Username, cfg.Password, cfg.Host)
	address := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)

	link := fmt.Sprintf("%s/auth/verify-email?token=%s", cfg.Verify, req.Code)

	msg := []byte("To: " + req.To + "\r\n" +
		"Subject: Verify your email\r\n" +
		"\r\n" +
		"Click the link to verify your email:\r\n" +
		link + "\r\n")

	err := smtp.SendMail(address, auth, cfg.From, []string{req.To}, msg)
	return err
}
