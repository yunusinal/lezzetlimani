package config

import (
	"fmt"
	"log"
	"strings"

	"github.com/spf13/viper"
)

var cachedConfig *Config

func LoadConfig() (*Config, error) {
	if cachedConfig != nil {
		return cachedConfig, nil
	}

	viper.SetConfigFile(".env")
	viper.SetConfigType("env")

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("read config: %w", err)
	}

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	cfg := &Config{}
	if err := viper.Unmarshal(cfg); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}

	cachedConfig = cfg
	return cfg, nil
}

func GetConfig() *Config {
	if cachedConfig == nil {
		c, err := LoadConfig()
		if err != nil {
			log.Fatal(err)
		}
		cachedConfig = c
	}
	return cachedConfig
}
