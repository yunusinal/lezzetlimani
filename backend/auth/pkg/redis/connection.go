package redis

import (
	"auth/pkg/configs"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client `inject:""`
}

func NewRedisClient() (*RedisClient, error) {
	cfg := configs.GetConfig()

	client := redis.NewClient(&redis.Options{
		Addr:            fmt.Sprintf("%s:%s", cfg.RedisConfig.Host, cfg.RedisConfig.Port),
		Password:        cfg.RedisConfig.Password,
		DialTimeout:     time.Duration(cfg.RedisConfig.DialTimeout) * time.Second,
		ReadTimeout:     time.Duration(cfg.RedisConfig.ReadTimeout) * time.Second,
		WriteTimeout:    time.Duration(cfg.RedisConfig.WriteTimeout) * time.Second,
		PoolTimeout:     time.Duration(cfg.RedisConfig.PoolTimeout) * time.Second,
		PoolSize:        cfg.RedisConfig.PoolSize,
		MinIdleConns:    cfg.RedisConfig.MinIdleConns,
		MaxIdleConns:    cfg.RedisConfig.MaxIdleConns,
		MaxActiveConns:  cfg.RedisConfig.MaxActiveConns,
		ConnMaxLifetime: cfg.RedisConfig.ConnMaxLifetime,
		ConnMaxIdleTime: cfg.RedisConfig.ConnMaxIdleTime,
		DB:              cfg.RedisConfig.DB,
	})

	// test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Ping(ctx).Result()
	if err != nil {
		log.Println("Error connecting to Redis:", err)
		return nil, err
	}

	return &RedisClient{Client: client}, nil
}

// Set
func (r *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	err := r.Client.Set(ctx, key, value, expiration).Err()
	if err != nil {
		log.Println("redis set error: ", err)
		return err
	}

	return nil
}

// Get
func (r *RedisClient) Get(ctx context.Context, key string) (string, error) {
	value, err := r.Client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", nil
	} else if err != nil {
		log.Println("redis get error: ", err)
		return "", err
	}
	return value, nil
}

// Delete
func (r *RedisClient) Delete(ctx context.Context, key string) error {
	err := r.Client.Del(ctx, key).Err()
	if err != nil {
		log.Println("redis delete error: ", err)
		return err
	}
	return nil
}

// Close
func (r *RedisClient) Close() error {
	log.Println("closing redis connection")
	return r.Client.Close()
}

// SetJson
func (r *RedisClient) SetJson(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		log.Println("redis set json error: ", err)
		return err
	}

	return r.Set(ctx, key, jsonData, expiration)
}

// GetJson
func (r *RedisClient) GetJSON(ctx context.Context, key string, dest interface{}) error {
	jsonData, err := r.Get(ctx, key)
	if err != nil {
		return err
	}

	if jsonData == "" {
		return nil
	}

	err = json.Unmarshal([]byte(jsonData), dest)
	if err != nil {
		log.Printf("Failed to unmarshal JSON from Redis: %v", err)
		return err
	}
	return nil
}
