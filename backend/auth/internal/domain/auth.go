package domain

import "time"

type Auth struct {
	ID         string    `json:"id" gorm:"primaryKey;type:varchar(255)"`
	Username   string    `json:"username" gorm:"uniqueIndex;type:varchar(255);not null"`
	Email      string    `json:"email" gorm:"uniqueIndex;type:varchar(255);not null"`
	Password   string    `json:"password" gorm:"type:varchar(255);not null"`
	IsVerified bool      `json:"is_verified" gorm:"type:boolean;default:false"`
	CreatedAt  time.Time `json:"created_at" gorm:"type:timestamp;not null"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"type:timestamp;not null"`
}

func (a *Auth) TableName() string {
	return "auths"
}
