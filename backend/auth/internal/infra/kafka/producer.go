package kafka

import (
	"auth/config"
	"context"
	"log"
	"strings"
	"time"

	"github.com/segmentio/kafka-go"
)

type ProducerInterface interface {
	Publish(ctx context.Context, key string, value []byte) error
	Close() error
}

type Producer struct {
	writer *kafka.Writer
}

func NewProducer(topic string) ProducerInterface {
	kafkaCfg := config.GetConfig().KafkaConfig
	brokers := kafkaCfg.Brokers

	if len(brokers) == 0 {
		log.Fatal("no kafka brokers configured")
	}

	if !strings.Contains(brokers[0], ":") {
		brokers[0] += ":9092"
	}

	writer := kafka.NewWriter(kafka.WriterConfig{
		Brokers:  brokers,
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	})

	return &Producer{writer: writer}
}

func (p *Producer) Publish(ctx context.Context, key string, value []byte) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	log.Printf("Kafka publish start: %v", key)

	err := p.writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(key),
		Value: value,
	})
	if err != nil {
		log.Printf("Kafka publish error: %v", err)
	}
	log.Printf("Kafka publish success: %v", key)
	return err
}

func (p *Producer) Close() error {
	return p.writer.Close()
}
