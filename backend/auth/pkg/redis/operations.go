package redis

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

func (r *RedisClient) BlacklistToken(ctx context.Context, token string, expiration time.Duration) error {
	err := r.Client.Set(ctx, "blacklist_tokens:"+token, "true", expiration).Err()
	if err != nil {
		log.Println("redis blacklist token error: ", err)
		return err
	}

	return nil
}

func (r *RedisClient) IsTokenBlacklisted(ctx context.Context, token string) (bool, error) {
	exists, err := r.Client.Get(ctx, "blacklist_tokens:"+token).Result()
	if err == redis.Nil {
		return false, nil
	} else if err != nil {
		log.Println("redis is token blacklisted error: ", err)
		return false, err
	}

	return exists == "true", nil
}

/*
TODO: add ip banned
TODO: count login attempts
TODO: reset login attempts after ttl
*/
