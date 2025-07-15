package repository

import (
	"context"
	"restaurant/internal/domain"
)

type RestaurantFilter struct {
	City    *string
	Status  *domain.RestaurantStatus
	OwnerID *string
	Sort    *string

	// New search filters
	Query       string   `json:"query"`         // Text search in name/description
	District    *string  `json:"district"`      // District filter
	MinRating   *float64 `json:"min_rating"`    // Minimum rating filter
	MaxDelivery *float64 `json:"max_delivery"`  // Maximum delivery fee
	MinOrder    *float64 `json:"min_order"`     // Minimum order amount
	MaxPrepTime *uint8   `json:"max_prep_time"` // Maximum prep time
	Cuisines    []string `json:"cuisines"`      // Cuisine types filter

	// Sorting options
	SortBy    string `json:"sort_by"`    // rating, delivery_fee, prep_time, name
	SortOrder string `json:"sort_order"` // asc, desc

	// Pagination
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
	Offset   int `json:"offset"`
	Limit    int `json:"limit"`
}

type RestaurantSearchResult struct {
	Restaurants []*domain.Restaurant `json:"restaurants"`
	Total       int64                `json:"total"`
	Page        int                  `json:"page"`
	PageSize    int                  `json:"page_size"`
	HasNext     bool                 `json:"has_next"`
}

type RestaurantRepository interface {
	Create(ctx context.Context, restaurant *domain.Restaurant) error
	GetByID(ctx context.Context, id string) (*domain.Restaurant, error)
	List(ctx context.Context, filter *RestaurantFilter) ([]*domain.Restaurant, error)
	Search(ctx context.Context, filter *RestaurantFilter) (*RestaurantSearchResult, error)
	Update(ctx context.Context, restaurant *domain.Restaurant) error
	Delete(ctx context.Context, id string) error
	ListCampaigns(ctx context.Context) ([]*domain.Campaign, error)
	CreateCampaign(ctx context.Context, campaign *domain.Campaign) error
}
