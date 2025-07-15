package test

import (
	"fmt"
	"log"
	"math/rand"
	"restaurant/internal/domain"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func InsertMockRestaurants(db *gorm.DB) error {
	rand.Seed(time.Now().UnixNano())

	for _, pair := range pairs {
		addressID := pair[0]
		restaurantID := pair[1]

		r := domain.Restaurant{
			ID:            restaurantID,
			OwnerID:       uuid.NewString(),
			Name:          names[rand.Intn(len(names))],
			Description:   descriptions[rand.Intn(len(descriptions))],
			Logo:          logos[rand.Intn(len(logos))],
			AddressID:     addressID,
			PhoneNumber:   fmt.Sprintf("05%09d", rand.Intn(1e9)),
			Email:         emails[rand.Intn(len(emails))],
			Status:        domain.RestaurantStatusOpen,
			OpeningHours:  domain.OpeningHours{"mon": "09:00-22:00", "tue": "09:00-22:00", "wed": "09:00-22:00"},
			PrepTime:      uint8(rand.Intn(30) + 10),
			RatingAvg:     rand.Float64()*4 + 1,
			RatingCount:   rand.Intn(1000),
			DeliveryFee:   rand.Float64()*20 + 5,
			MinOrderPrice: rand.Float64()*50 + 20,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		if err := db.Create(&r).Error; err != nil {
			log.Println("Hata oluştu:", err)
		} else {
			fmt.Println("✅ Mock restoran eklendi:", r.Name, r.ID)
		}
	}
	return nil
}
