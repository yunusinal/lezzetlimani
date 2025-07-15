package kafka

import (
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type NotificationEvent struct {
	Type      string            `json:"type"`
	To        string            `json:"to"`
	Subject   string            `json:"subject"`
	Template  string            `json:"template"`
	Variables map[string]string `json:"variables"`
}

type Publisher struct {
	Writer *kafka.Writer
}

func NewPublisher(brokers []string, topic string) *Publisher {
	return &Publisher{
		Writer: &kafka.Writer{
			Addr:     kafka.TCP(brokers...),
			Topic:    topic,
			Balancer: &kafka.LeastBytes{},
		},
	}
}

func (p *Publisher) Publish(ctx context.Context, event NotificationEvent) error {
	msgBytes, err := json.Marshal(event)
	if err != nil {
		return err
	}
	msg := kafka.Message{
		Value: msgBytes,
	}
	if err := p.Writer.WriteMessages(ctx, msg); err != nil {
		log.Printf("Failed to publish notification event: %v", err)
		return err
	}
	return nil
}
