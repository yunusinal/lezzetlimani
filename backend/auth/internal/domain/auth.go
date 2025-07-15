package domain

import (
	"time"

	"gorm.io/gorm"
)

const (
	RoleUser    = "user"
	RoleAdmin   = "admin"
	RoleManager = "manager"
)

type Auth struct {
	ID        string         `json:"id"`
	UserID    string         `json:"user_id"`
	Email     string         `json:"email" gorm:"not null;unique"`
	Password  string         `json:"password" gorm:"not null"`
	Role      string         `json:"role" gorm:"not null;size:255"`
	Verified  bool           `json:"verified" gorm:"not null;default:false"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (a *Auth) TableName() string {
	return "auth_db"
}
