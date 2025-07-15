package cron

import (
	"auth/internal/infra/redis"
	"auth/internal/repository"
	"context"
	"log"
	"time"
)

// StartExpiredTokenCleanup starts a background job to delete expired verification tokens and associated auth records.
func StartExpiredTokenCleanup(ctx context.Context, redis redis.RedisClient, repo repository.AuthRepository, interval time.Duration) {
	ticker := time.NewTicker(interval)

	go func() {
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				keys, err := redis.ScanKeys(ctx, "verify:*")
				if err != nil {
					log.Println("cron error: failed to scan redis keys:", err)
					continue
				}

				for _, key := range keys {
					ttl, err := redis.TTL(ctx, key)
					if err != nil || ttl > 0 || ttl == -1 {
						continue // still valid or permanent
					}

					authID, err := redis.Get(ctx, key)
					if err != nil {
						log.Println("cron error: failed to get authID from Redis:", err)
						continue
					}

					if err := repo.Delete(ctx, authID); err != nil {
						log.Println("cron error: failed to delete user from db:", err)
						continue
					}

					if err := redis.Del(ctx, key); err != nil {
						log.Println("cron error: failed to delete key from redis:", err)
						continue
					}

					log.Printf("cron: expired token cleaned: %s (authID: %s)\n", key, authID)
				}

			case <-ctx.Done():
				log.Println("cron: token cleanup stopped")
				return
			}
		}
	}()
}
