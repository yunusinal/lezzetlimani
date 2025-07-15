package redis

import (
	"auth/config"
	"auth/pkg/errors"
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient() (*RedisClient, error) {
	cfg := config.GetConfig().RedisConfig

	client := redis.NewClient(&redis.Options{
		Addr:            fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password:        cfg.Password,
		DB:              cfg.DB,
		PoolSize:        cfg.PoolSize,
		MaxIdleConns:    cfg.MaxIdle,
		MinIdleConns:    cfg.MinIdle,
		MaxActiveConns:  cfg.MaxActive,
		ConnMaxIdleTime: time.Duration(cfg.ConnMaxIdleTime) * time.Second,
		ReadTimeout:     time.Duration(cfg.ReadTimeout) * time.Second,
		WriteTimeout:    time.Duration(cfg.WriteTimeout) * time.Second,
		PoolTimeout:     time.Duration(cfg.PoolTimeout) * time.Second,
		DialTimeout:     time.Duration(cfg.DialTimeout) * time.Second,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := client.Ping(ctx).Result(); err != nil {
		return nil, errors.New("REDIS_PING", err.Error())
	}

	return &RedisClient{Client: client}, nil
}

func (c *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	if err := c.Client.Set(ctx, key, value, expiration).Err(); err != nil {
		return errors.New("REDIS_SET", err.Error())
	}
	return nil
}

func (c *RedisClient) Get(ctx context.Context, key string) (string, error) {
	value, err := c.Client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", errors.New("REDIS_NIL", "key not found")
	} else if err != nil {
		return "", errors.New("REDIS_GET", err.Error())
	}
	return value, nil
}

func (c *RedisClient) Del(ctx context.Context, key string) error {
	if err := c.Client.Del(ctx, key).Err(); err != nil {
		return errors.New("REDIS_DEL", err.Error())
	}
	return nil
}

func (c *RedisClient) SetJSON(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return errors.New("REDIS_MARSHAL", err.Error())
	}
	return c.Set(ctx, key, data, expiration)
}

func (c *RedisClient) GetJSON(ctx context.Context, key string, target interface{}) error {
	data, err := c.Get(ctx, key)
	if err != nil {
		return err
	}
	if err := json.Unmarshal([]byte(data), target); err != nil {
		return errors.New("REDIS_UNMARSHAL", err.Error())
	}
	return nil
}

func (c *RedisClient) Close() error {
	return c.Client.Close()
}

func (c *RedisClient) ScanKeys(ctx context.Context, pattern string) ([]string, error) {
	iter := c.Client.Scan(ctx, 0, pattern, 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	return keys, iter.Err()
}

func (c *RedisClient) TTL(ctx context.Context, key string) (time.Duration, error) {
	return c.Client.TTL(ctx, key).Result()
}
