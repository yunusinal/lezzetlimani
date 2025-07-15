package db

import (
	"auth/config"
	"auth/internal/domain"
	"auth/pkg/errors"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func getDSN() string {
	cfg := config.GetConfig().DatabaseConfig

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port)

	return dsn
}

func NewDB() (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(getDSN()), &gorm.Config{})
	if err != nil {
		return nil, errors.New("DB_ERROR", "failed to connect to database")
	}

	// ping database

	sqlDB, err := db.DB()
	if err != nil {
		return nil, errors.New("DB_ERROR", "failed to get database")
	}

	err = sqlDB.Ping()
	if err != nil {
		return nil, errors.New("DB_ERROR", "failed to ping database")
	}

	db.AutoMigrate(&domain.Auth{})

	return db, nil
}

func CloseDB(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return errors.New("DB_ERROR", "failed to get database")
	}

	err = sqlDB.Close()
	if err != nil {
		return errors.New("DB_ERROR", "failed to close database")
	}

	return nil
}

// TODO: add pool settings
// TODO:add migrations settings
