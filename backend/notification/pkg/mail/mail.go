package mail

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"notification/pkg/configs"
	"notification/pkg/mail/dto"
)

func SendEmail(req dto.VerificationEmailRequest) (dto.VerificationEmailResponse, error) {
	cfg := configs.GetConfig()

	log.Println("Sending email to", req.To)

	host := cfg.Email.Host
	port := cfg.Email.Port
	username := cfg.Email.Username
	password := cfg.Email.Password
	from := cfg.Email.From

	// SMTP sunucusuna bağlantı
	conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", host, port))
	if err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("dial error: %w", err)
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("smtp client error: %w", err)
	}

	// TLS bağlantısı başlat
	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         host,
	}
	if err = client.StartTLS(tlsconfig); err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("starttls error: %w", err)
	}

	// SMTP Auth
	auth := smtp.PlainAuth("", username, password, host)
	if err = client.Auth(auth); err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("auth error: %w", err)
	}

	// Mail başlat
	if err = client.Mail(from); err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("mail from error: %w", err)
	}
	if err = client.Rcpt(req.To); err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("rcpt to error: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("data error: %w", err)
	}

	url := fmt.Sprintf("%s/auth/verify-email?token=%s", cfg.Email.Verify, req.Code)

	message := fmt.Sprintf("To: %s\r\nSubject: Verify your email\r\n\r\nClick the link below to verify your email:\r\n%s\r\n", req.To, url)

	_, err = w.Write([]byte(message))
	if err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("write error: %w", err)
	}

	err = w.Close()
	if err != nil {
		return dto.VerificationEmailResponse{}, fmt.Errorf("close error: %w", err)
	}

	client.Quit()

	log.Println("Email sent successfully to", req.To)
	return dto.VerificationEmailResponse{
		Message: "Email sent successfully",
	}, nil
}

func SendPasswordResetEmail(req dto.PasswordResetEmailRequest) (dto.PasswordResetEmailResponse, error) {
	cfg := configs.GetConfig()

	log.Println("Sending password reset email to", req.To)

	host := cfg.Email.Host
	port := cfg.Email.Port
	username := cfg.Email.Username
	password := cfg.Email.Password
	from := cfg.Email.From

	conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", host, port))
	if err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("dial error: %w", err)
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("smtp client error: %w", err)
	}

	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         host,
	}
	if err = client.StartTLS(tlsconfig); err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("starttls error: %w", err)
	}

	auth := smtp.PlainAuth("", username, password, host)
	if err = client.Auth(auth); err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("auth error: %w", err)
	}

	if err = client.Mail(from); err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("mail from error: %w", err)
	}
	if err = client.Rcpt(req.To); err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("rcpt to error: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("data error: %w", err)
	}

	url := fmt.Sprintf("%s/auth/reset-password?token=%s", cfg.Email.Verify, req.Code)

	message := fmt.Sprintf("To: %s\r\nSubject: Password Reset\r\n\r\nClick the link below to reset your password:\r\n%s\r\n", req.To, url)

	_, err = w.Write([]byte(message))
	if err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("write error: %w", err)
	}

	err = w.Close()
	if err != nil {
		return dto.PasswordResetEmailResponse{}, fmt.Errorf("close error: %w", err)
	}

	client.Quit()

	log.Println("Password reset email sent successfully to", req.To)
	return dto.PasswordResetEmailResponse{
		Message: "Password reset email sent successfully",
	}, nil
}

func SendDiscountEmail(req dto.DiscountEmailRequest) (dto.DiscountEmailResponse, error) {
	cfg := configs.GetConfig()

	log.Println("Sending discount/campaign email to", req.To)

	host := cfg.Email.Host
	port := cfg.Email.Port
	username := cfg.Email.Username
	password := cfg.Email.Password
	from := cfg.Email.From

	conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", host, port))
	if err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("dial error: %w", err)
	}

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("smtp client error: %w", err)
	}
	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         host,
	}
	if err = client.StartTLS(tlsconfig); err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("starttls error: %w", err)
	}
	auth := smtp.PlainAuth("", username, password, host)
	if err = client.Auth(auth); err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("auth error: %w", err)
	}
	if err = client.Mail(from); err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("mail from error: %w", err)
	}
	if err = client.Rcpt(req.To); err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("rcpt to error: %w", err)
	}
	w, err := client.Data()
	if err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("data error: %w", err)
	}
	message := fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s\r\n", req.To, req.Title, req.Description)
	_, err = w.Write([]byte(message))
	if err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("write error: %w", err)
	}
	err = w.Close()
	if err != nil {
		return dto.DiscountEmailResponse{}, fmt.Errorf("close error: %w", err)
	}
	client.Quit()
	log.Println("Discount/campaign email sent successfully to", req.To)
	return dto.DiscountEmailResponse{
		Message: "Discount/campaign email sent successfully",
	}, nil
}
