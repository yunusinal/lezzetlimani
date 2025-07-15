package kafka

import (
	"context"
	"encoding/json"
	"log"
	"notification/pkg/configs"
	"notification/pkg/kafka/dto"
	"notification/pkg/mail"
	maildto "notification/pkg/mail/dto"
)

func StartEmailEventConsumer(ctx context.Context, cfg *configs.KafkaConfig) {
	reader := NewKafkaReader(cfg.Brokers, cfg.Topic.EmailEvent, cfg.GroupID)

	handler := func(data []byte) error {
		log.Println("---- New Kafka Message Received ----")
		log.Printf("Raw kafka message: %s", string(data))

		var evt dto.EmailEvent
		if err := json.Unmarshal(data, &evt); err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			return err
		}

		log.Printf("Parsed Event: Type=%s, To=%s, Variables=%v", evt.Type, evt.To, evt.Variables)

		switch evt.Type {
		case "verification":
			log.Printf("Sending verification email to: %s", evt.To)
			resp, err := mail.SendEmail(maildto.VerificationEmailRequest{
				To:   evt.To,
				Code: evt.Variables["token"],
			})
			if err != nil {
				log.Printf("Failed to send email: %v", err)
				return err
			}
			log.Printf("Email sent successfully. Message: %s", resp.Message)
		case "password_reset":
			log.Printf("Sending password reset email to: %s", evt.To)
			resp, err := mail.SendPasswordResetEmail(maildto.PasswordResetEmailRequest{
				To:   evt.To,
				Code: evt.Variables["token"],
			})
			if err != nil {
				log.Printf("Failed to send password reset email: %v", err)
				return err
			}
			log.Printf("Password reset email sent successfully. Message: %s", resp.Message)
		case "discount":
			log.Printf("Sending discount/campaign email to: %s", evt.To)
			resp, err := mail.SendDiscountEmail(maildto.DiscountEmailRequest{
				To:          evt.To,
				Title:       evt.Variables["title"],
				Description: evt.Variables["description"],
			})
			if err != nil {
				log.Printf("Failed to send discount/campaign email: %v", err)
				return err
			}
			log.Printf("Discount/campaign email sent successfully. Message: %s", resp.Message)
		default:
			log.Printf("Skipped unknown event type: %s", evt.Type)
		}
		return nil
	}

	reader.ReadLoop(ctx, handler)
}
