package db

import (
	"fmt"
	"restaurant/config"
	"restaurant/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	db *gorm.DB
}

func getDSN() string {
	cfg := config.GetConfig().DBConfig

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName)

	return dsn
}

func NewDB() (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(getDSN()), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("DB_ERROR: %w", err)
	}

	// ping database

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("DB_ERROR: %w", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		return nil, fmt.Errorf("DB_ERROR: %w", err)
	}

	err = db.AutoMigrate(&domain.Restaurant{})
	if err != nil {
		return nil, fmt.Errorf("DB_ERROR: %w", err)
	}

	return db, nil
}

func CloseDB(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("DB_ERROR: %w", err)
	}

	err = sqlDB.Close()
	if err != nil {
		return fmt.Errorf("DB_ERROR: %w", err)
	}

	return nil
}
