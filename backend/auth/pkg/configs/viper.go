package configs

import (
	"log"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	DBConfig        DBConfig
	RedisConfig     RedisConfig
	KafkaConfig     KafkaConfig
	TokenConfig     TokenConfig
	RateLimitConfig RateLimitConfig
}

type DBConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"db_name"`
}

type RedisConfig struct {
	Host            string        `mapstructure:"host"`
	Port            string        `mapstructure:"port"`
	Password        string        `mapstructure:"password"`
	DB              int           `mapstructure:"db"`
	PoolSize        int           `mapstructure:"pool_size"`
	MinIdleConns    int           `mapstructure:"min_idle_conns"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	MaxActiveConns  int           `mapstructure:"max_active_conns"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`
	ConnMaxIdleTime time.Duration `mapstructure:"conn_max_idle_time"`
	ReadTimeout     int           `mapstructure:"read_timeout"`
	WriteTimeout    int           `mapstructure:"write_timeout"`
	PoolTimeout     int           `mapstructure:"pool_timeout"`
	DialTimeout     int           `mapstructure:"dial_timeout"`
}

type KafkaConfig struct {
	Brokers []string `mapstructure:"brokers"`
	Topic   string   `mapstructure:"topic"`
	GroupID string   `mapstructure:"group_id"`
}

type SMTPConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
}

type TokenConfig struct {
	AccessSecretKey  string `mapstructure:"access_secret_key"`
	RefreshSecretKey string `mapstructure:"refresh_secret_key"`
	AccessExpire     int    `mapstructure:"access_expire"`
	RefreshExpire    int    `mapstructure:"refresh_expire"`
}

type RateLimitConfig struct {
	MaxLoginAttempts int `mapstructure:"max_login_attempts"`
	LoginAttemptsTTL int `mapstructure:"login_attempts_ttl"`
}

var cachedConfig *Config

func LoadConfig() (*Config, error) {
	if cachedConfig != nil {
		return cachedConfig, nil
	}

	viper.AutomaticEnv()
	viper.SetConfigType("env")
	viper.SetConfigFile(".env")

	if err := viper.ReadInConfig(); err != nil {
		log.Println("Error reading config file:", err)
	}

	config := &Config{}
	if err := viper.Unmarshal(config); err != nil {
		log.Println("Error unmarshalling config:", err)
	}

	cachedConfig = config
	return config, nil
}

func GetConfig() *Config {
	if cachedConfig == nil {
		conf, err := LoadConfig()
		if err != nil {
			log.Fatal("Error loading config:", err)
		}
		cachedConfig = conf
	}
	return cachedConfig
}
