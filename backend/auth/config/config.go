package config

import "time"

type Config struct {
	JWTConfig      `mapstructure:",squash"`
	ServerConfig   `mapstructure:",squash"`
	DatabaseConfig `mapstructure:",squash"`
	RedisConfig    `mapstructure:",squash"`
	KafkaConfig    `mapstructure:",squash"`
	EmailConfig    `mapstructure:",squash"`
}

type JWTConfig struct {
	AccessSecretKey  string `mapstructure:"JWT_ACCESS_SECRET_KEY"`
	RefreshSecretKey string `mapstructure:"JWT_REFRESH_SECRET_KEY"`
	AccessExpire     int    `mapstructure:"JWT_ACCESS_EXPIRE"`
	RefreshExpire    int    `mapstructure:"JWT_REFRESH_EXPIRE"`
}

type ServerConfig struct {
	Port string `mapstructure:"SERVER_PORT"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"DB_HOST"`
	Port     string `mapstructure:"DB_PORT"`
	User     string `mapstructure:"DB_USER"`
	Password string `mapstructure:"DB_PASSWORD"`
	Name     string `mapstructure:"DB_NAME"`
}

type RedisConfig struct {
	Host            string        `mapstructure:"REDIS_HOST"`
	Port            string        `mapstructure:"REDIS_PORT"`
	Password        string        `mapstructure:"REDIS_PASSWORD"`
	DB              int           `mapstructure:"REDIS_DB"`
	PoolSize        int           `mapstructure:"REDIS_POOL_SIZE"`
	MaxIdle         int           `mapstructure:"REDIS_MAX_IDLE_CONNS"`
	MinIdle         int           `mapstructure:"REDIS_MIN_IDLE_CONNS"`
	MaxActive       int           `mapstructure:"REDIS_MAX_ACTIVE_CONNS"`
	ConnMaxLifetime time.Duration `mapstructure:"REDIS_CONN_MAX_LIFETIME"`
	ConnMaxIdleTime time.Duration `mapstructure:"REDIS_CONN_MAX_IDLE_TIME"`
	ReadTimeout     int           `mapstructure:"REDIS_READ_TIMEOUT"`
	WriteTimeout    int           `mapstructure:"REDIS_WRITE_TIMEOUT"`
	PoolTimeout     int           `mapstructure:"REDIS_POOL_TIMEOUT"`
	DialTimeout     int           `mapstructure:"REDIS_DIAL_TIMEOUT"`
}

type KafkaConfig struct {
	Brokers []string `mapstructure:"KAFKA_BROKERS"`
	Topic   Topic    `mapstructure:",squash"`
}

type Topic struct {
	UserCreated string `mapstructure:"KAFKA_TOPIC_USER_CREATED"`
	EmailEvent  string `mapstructure:"KAFKA_TOPIC_EMAIL_EVENT"`
}

type EmailConfig struct {
	Host     string `mapstructure:"EMAIL_HOST"`
	Port     string `mapstructure:"EMAIL_PORT"`
	Username string `mapstructure:"EMAIL_USERNAME"`
	Password string `mapstructure:"EMAIL_PASSWORD"`
	From     string `mapstructure:"EMAIL_FROM"`
	Verify   string `mapstructure:"EMAIL_VERIFY"`
}
