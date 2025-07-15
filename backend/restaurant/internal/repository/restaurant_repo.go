package repository

import (
	"context"
	"errors"
	"fmt"
	"restaurant/internal/domain"
	"strings"

	"gorm.io/gorm"
)

type restaurantRepository struct {
	db *gorm.DB
}

func NewRestaurantRepository(db *gorm.DB) RestaurantRepository {
	return &restaurantRepository{db: db}
}

func (r *restaurantRepository) Create(ctx context.Context, restaurant *domain.Restaurant) error {
	return r.db.WithContext(ctx).Create(restaurant).Error
}

func (r *restaurantRepository) GetByID(ctx context.Context, id string) (*domain.Restaurant, error) {
	var restaurant domain.Restaurant
	if err := r.db.WithContext(ctx).
		First(&restaurant, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("restaurant not found")
		}
		return nil, err
	}
	return &restaurant, nil
}

func (r *restaurantRepository) List(ctx context.Context, filter *RestaurantFilter) ([]*domain.Restaurant, error) {
	var restaurants []*domain.Restaurant
	query := r.db.WithContext(ctx).Model(&domain.Restaurant{})

	// Apply filters using the same logic as Search
	query = r.applyFilters(query, filter)

	// Apply pagination
	offset, limit := r.calculatePagination(filter.Page, filter.PageSize, filter.Offset, filter.Limit)
	query = query.Offset(offset).Limit(limit)

	// Apply sorting
	query = r.applySorting(query, filter)

	if err := query.Find(&restaurants).Error; err != nil {
		return nil, err
	}
	return restaurants, nil
}

func (r *restaurantRepository) Search(ctx context.Context, filter *RestaurantFilter) (*RestaurantSearchResult, error) {
	var restaurants []*domain.Restaurant
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Restaurant{})

	// Apply filters
	query = r.applyFilters(query, filter)

	// Count total results
	if err := query.Count(&total).Error; err != nil {
		return nil, fmt.Errorf("failed to count restaurants: %w", err)
	}

	// Apply sorting
	query = r.applySorting(query, filter)

	// Apply pagination
	offset, limit := r.calculatePagination(filter.Page, filter.PageSize, filter.Offset, filter.Limit)
	query = query.Offset(offset).Limit(limit)

	// Execute query
	if err := query.Find(&restaurants).Error; err != nil {
		return nil, fmt.Errorf("failed to search restaurants: %w", err)
	}

	page := filter.Page
	if page <= 0 {
		page = 1
	}

	return &RestaurantSearchResult{
		Restaurants: restaurants,
		Total:       total,
		Page:        page,
		PageSize:    limit,
		HasNext:     int64(offset+limit) < total,
	}, nil
}

func (r *restaurantRepository) applyFilters(query *gorm.DB, filter *RestaurantFilter) *gorm.DB {
	// Existing filters
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.OwnerID != nil {
		query = query.Where("owner_id = ?", *filter.OwnerID)
	}
	if filter.City != nil {
		query = query.Where("LOWER(city) = LOWER(?)", *filter.City)
	}

	// New advanced filters
	if filter.Query != "" {
		searchQuery := "%" + strings.ToLower(filter.Query) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", searchQuery, searchQuery)
	}

	if filter.District != nil {
		query = query.Where("LOWER(district) = LOWER(?)", *filter.District)
	}

	if filter.MinRating != nil {
		query = query.Where("rating_avg >= ?", *filter.MinRating)
	}

	if filter.MaxDelivery != nil {
		query = query.Where("delivery_fee <= ?", *filter.MaxDelivery)
	}

	if filter.MinOrder != nil {
		query = query.Where("min_order_price >= ?", *filter.MinOrder)
	}

	if filter.MaxPrepTime != nil {
		query = query.Where("prep_time <= ?", *filter.MaxPrepTime)
	}

	// Cuisine filters - assuming cuisines are stored as comma-separated values or in a related table
	if len(filter.Cuisines) > 0 {
		conditions := []string{}
		args := []interface{}{}
		for _, cuisine := range filter.Cuisines {
			conditions = append(conditions, "LOWER(description) LIKE LOWER(?)")
			args = append(args, "%"+cuisine+"%")
		}
		if len(conditions) > 0 {
			query = query.Where(strings.Join(conditions, " OR "), args...)
		}
	}

	return query
}

func (r *restaurantRepository) applySorting(query *gorm.DB, filter *RestaurantFilter) *gorm.DB {
	// Default sorting
	orderBy := "rating_avg DESC, created_at DESC"

	// Legacy sort support
	if filter.Sort != nil {
		return query.Order(*filter.Sort)
	}

	// New advanced sorting
	if filter.SortBy != "" {
		direction := "ASC"
		if filter.SortOrder == "desc" {
			direction = "DESC"
		}

		switch filter.SortBy {
		case "rating":
			orderBy = fmt.Sprintf("rating_avg %s", direction)
		case "delivery_fee":
			orderBy = fmt.Sprintf("delivery_fee %s", direction)
		case "prep_time":
			orderBy = fmt.Sprintf("prep_time %s", direction)
		case "min_order":
			orderBy = fmt.Sprintf("min_order_price %s", direction)
		case "name":
			orderBy = fmt.Sprintf("name %s", direction)
		case "created_at":
			orderBy = fmt.Sprintf("created_at %s", direction)
		}
	}

	return query.Order(orderBy)
}

func (r *restaurantRepository) calculatePagination(page, pageSize, offset, limit int) (int, int) {
	// Use new pagination if provided
	if page > 0 && pageSize > 0 {
		if pageSize > 100 {
			pageSize = 100 // Max page size
		}
		calculatedOffset := (page - 1) * pageSize
		return calculatedOffset, pageSize
	}

	// Fallback to legacy pagination
	if limit <= 0 {
		limit = 20 // Default limit
	}
	if limit > 100 {
		limit = 100 // Max limit
	}
	return offset, limit
}

func (r *restaurantRepository) Update(ctx context.Context, restaurant *domain.Restaurant) error {
	return r.db.WithContext(ctx).Save(restaurant).Error
}

func (r *restaurantRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Restaurant{}, "id = ?", id).Error
}

func (r *restaurantRepository) ListCampaigns(ctx context.Context) ([]*domain.Campaign, error) {
	var campaigns []*domain.Campaign
	if err := r.db.WithContext(ctx).Model(&domain.Campaign{}).Find(&campaigns).Error; err != nil {
		return nil, err
	}
	return campaigns, nil
}

func (r *restaurantRepository) CreateCampaign(ctx context.Context, campaign *domain.Campaign) error {
	return r.db.WithContext(ctx).Create(campaign).Error
}
