package domain

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

type RestaurantStatus string

const (
	RestaurantStatusOpen   RestaurantStatus = "open"
	RestaurantStatusClosed RestaurantStatus = "closed"
)

type OpeningHours map[string]string

// Scan implements the sql.Scanner interface for OpeningHours
func (oh *OpeningHours) Scan(value interface{}) error {
	if value == nil {
		*oh = OpeningHours{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(bytes, oh)
}

// Value implements the driver.Valuer interface for OpeningHours
func (oh OpeningHours) Value() (driver.Value, error) {
	if oh == nil {
		return nil, nil
	}
	return json.Marshal(oh)
}

type Restaurant struct {
	// identity
	ID      string `json:"id" gorm:"type:uuid;not null;primaryKey"`
	OwnerID string `json:"owner_id" gorm:"not null;index;type:uuid"`

	// base info
	Name        string `json:"name" gorm:"size:128;not null"`
	Description string `json:"description" gorm:"type:text"`
	Logo        string `json:"logo" gorm:"size:255"`

	// location
	AddressID string `json:"address_id" gorm:"type:uuid;not null"`

	// info
	PhoneNumber string `json:"phone_number" gorm:"size:16"`
	Email       string `json:"email" gorm:"size:255"`

	// status
	Status       RestaurantStatus `json:"status" gorm:"not null"`
	OpeningHours OpeningHours     `json:"opening_hours" gorm:"not null;type:jsonb"`
	PrepTime     uint8            `json:"prep_time" gorm:"not null"`

	// rating
	RatingAvg   float64 `json:"rating_avg" gorm:"default:0.0;type:numeric(10,2)"`
	RatingCount int     `json:"rating_count" gorm:"default:0;type:integer"`

	// delivery
	DeliveryFee   float64 `json:"delivery_fee" gorm:"not null;type:numeric(10,2)"`
	MinOrderPrice float64 `json:"min_order_price" gorm:"not null;type:numeric(10,2)"`

	// created at
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type Campaign struct {
	ID           string    `json:"id" gorm:"type:uuid;not null;primaryKey"`
	Title        string    `json:"title" gorm:"not null"`
	Description  string    `json:"description" gorm:"type:text"`
	StartDate    time.Time `json:"start_date" gorm:"not null"`
	EndDate      time.Time `json:"end_date" gorm:"not null"`
	RestaurantID string    `json:"restaurant_id" gorm:"type:uuid;not null"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
