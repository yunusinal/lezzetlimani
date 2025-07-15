package redis

import (
	"auth/pkg/errors"
	"context"
	"strconv"
	"time"
)

type RedisService interface {
	// Token blacklist
	BlacklistToken(ctx context.Context, tokenID string, duration time.Duration) error
	IsTokenBlacklisted(ctx context.Context, tokenID string) (bool, error)

	// IP ban / rate limit
	RegisterFailedAttempt(ctx context.Context, ip string) error
	IsIPRateLimited(ctx context.Context, ip string) (bool, error)
	ExplicitlyBanIP(ctx context.Context, ip string) error
	IsIPExplicitlyBanned(ctx context.Context, ip string) (bool, error)
	ClearFailedAttempts(ctx context.Context, ip string) error

	// Refresh token
	SetRefreshToken(ctx context.Context, userID string, token string, duration time.Duration) error
	GetRefreshToken(ctx context.Context, userID string) (string, error)
	DeleteRefreshToken(ctx context.Context, userID string) error
}

type RedisServiceImpl struct {
	redisClient RedisClient
}

func NewRedisService(redisClient RedisClient) RedisService {
	return &RedisServiceImpl{redisClient: redisClient}
}

const (
	blacklistPrefix = "blacklist:"
	refreshPrefix   = "refresh:"
	ipFailPrefix    = "ip:fail:"
	ipBanPrefix     = "ip:ban:"
	maxFailCount    = 5
	failureWindow   = 15 * time.Minute
	explicitBanTime = 1 * time.Hour
)

// Token Blacklist
func (s *RedisServiceImpl) BlacklistToken(ctx context.Context, tokenID string, duration time.Duration) error {
	return s.redisClient.Set(ctx, blacklistPrefix+tokenID, "1", duration)
}

func (s *RedisServiceImpl) IsTokenBlacklisted(ctx context.Context, tokenID string) (bool, error) {
	_, err := s.redisClient.Get(ctx, blacklistPrefix+tokenID)
	if errors.IsAppError(err, "REDIS_NIL") {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

// IP Rate Limit
func (s *RedisServiceImpl) RegisterFailedAttempt(ctx context.Context, ip string) error {
	key := ipFailPrefix + ip
	pipe := s.redisClient.Client.TxPipeline()
	pipe.Incr(ctx, key)
	pipe.Expire(ctx, key, failureWindow)
	if _, err := pipe.Exec(ctx); err != nil {
		return errors.New("REDIS_PIPELINE", err.Error())
	}
	return nil
}

func (s *RedisServiceImpl) IsIPRateLimited(ctx context.Context, ip string) (bool, error) {
	val, err := s.redisClient.Get(ctx, ipFailPrefix+ip)
	if err != nil {
		if errors.IsAppError(err, "REDIS_NIL") {
			return false, nil
		}
		return false, err
	}
	count, errConv := strconv.Atoi(val)
	if errConv != nil {
		return false, errors.New("REDIS_PARSE", "fail count parse error")
	}
	return count >= maxFailCount, nil
}

func (s *RedisServiceImpl) ExplicitlyBanIP(ctx context.Context, ip string) error {
	return s.redisClient.Set(ctx, ipBanPrefix+ip, "1", explicitBanTime)
}

func (s *RedisServiceImpl) IsIPExplicitlyBanned(ctx context.Context, ip string) (bool, error) {
	_, err := s.redisClient.Get(ctx, ipBanPrefix+ip)
	if errors.IsAppError(err, "REDIS_NIL") {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

// Refresh Token
func (s *RedisServiceImpl) SetRefreshToken(ctx context.Context, userID string, token string, duration time.Duration) error {
	return s.redisClient.Set(ctx, refreshPrefix+userID, token, duration)
}

func (s *RedisServiceImpl) GetRefreshToken(ctx context.Context, userID string) (string, error) {
	return s.redisClient.Get(ctx, refreshPrefix+userID)
}

func (s *RedisServiceImpl) DeleteRefreshToken(ctx context.Context, userID string) error {
	return s.redisClient.Del(ctx, refreshPrefix+userID)
}

func (s *RedisServiceImpl) ClearFailedAttempts(ctx context.Context, ip string) error {
	return s.redisClient.Del(ctx, ipFailPrefix+ip)
}
