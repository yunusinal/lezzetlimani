package kafka

import (
	"auth/config"
	"auth/internal/dtos"
	"context"
	"encoding/json"
)

type EventPublisher interface {
	PublishEmailEvent(ctx context.Context, evt dtos.EmailEvent) error
	PublishUserCreateEvent(ctx context.Context, evt dtos.UserCreateEvent) error
}

type KafkaPublisher struct{}

func NewKafkaPublisher() *KafkaPublisher {
	return &KafkaPublisher{}
}

func (p *KafkaPublisher) PublishUserCreateEvent(ctx context.Context, req dtos.UserCreateEvent) error {
	return publish(ctx, req.UserID, req, config.GetConfig().KafkaConfig.Topic.UserCreated)
}

func (p *KafkaPublisher) PublishEmailEvent(ctx context.Context, req dtos.EmailEvent) error {
	return publish(ctx, req.To, req, config.GetConfig().KafkaConfig.Topic.EmailEvent)
}

// generic publisher
func publish[T any](ctx context.Context, key string, payload T, topic string) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	producer := NewProducer(topic)
	defer producer.Close()

	return producer.Publish(ctx, key, data)
}
