package kafka

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type KafkaReaderService struct {
	reader *kafka.Reader
	topic  string
}

func NewKafkaReader(brokers []string, topic, groupID string) *KafkaReaderService {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:        brokers,
		Topic:          topic,
		GroupID:        groupID,
		StartOffset:    kafka.FirstOffset,
		MinBytes:       10e3,
		MaxBytes:       10e6,
		QueueCapacity:  100,
		CommitInterval: time.Second,
	})

	return &KafkaReaderService{
		reader: reader,
		topic:  topic,
	}
}

func (k *KafkaReaderService) ReadLoop(ctx context.Context, handler func([]byte) error) {
	log.Printf("✅ Kafka consumer initialized. Listening on topic: %s", k.topic)

	for {
		msg, err := k.reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("❌ Kafka read error: %v", err)
			continue
		}

		log.Printf("📥 Kafka message received on topic %s: %s", k.topic, string(msg.Value))

		if err := handler(msg.Value); err != nil {
			log.Printf("⚠️ Handler processing error: %v", err)
		} else {
			log.Println("✅ Handler processed message successfully.")
		}
	}
}

func (k *KafkaReaderService) Close() error {
	return k.reader.Close()
}
