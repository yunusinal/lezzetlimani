package handler

import (
	"log"
	"net/http"
	"restaurant/internal/domain"
	"restaurant/internal/dtos"
	"restaurant/internal/repository"
	"restaurant/internal/usecase"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type restaurantHandler struct {
	restaurantUseCase usecase.RestaurantUseCase
}

func NewRestaurantHandler(restaurantUseCase usecase.RestaurantUseCase) RestaurantHandler {
	return &restaurantHandler{restaurantUseCase: restaurantUseCase}
}

// Create creates a new restaurant
// @Summary Create a new restaurant
// @Description Create a new restaurant with the provided information
// @Tags restaurants
// @Accept json
// @Produce json
// @Param restaurant body dtos.CreateRestaurantRequest true "Restaurant creation data"
// @Success 201 {object} map[string]string "Restaurant created successfully"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /restaurants [post]
func (h *restaurantHandler) Create(c *gin.Context) {
	var rest *dtos.CreateRestaurantRequest
	if err := c.ShouldBindJSON(&rest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.restaurantUseCase.Create(c, rest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Restaurant created successfully"})
}

// GetByID retrieves a restaurant by ID
// @Summary Get restaurant by ID
// @Description Get a restaurant by its unique identifier
// @Tags restaurants
// @Accept json
// @Produce json
// @Param id path string true "Restaurant ID"
// @Success 200 {object} dtos.RestaurantResponse "Restaurant details"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /restaurants/{id} [get]
func (h *restaurantHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	restaurant, err := h.restaurantUseCase.GetByID(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, restaurant)
}

// List retrieves all restaurants with optional filtering
// @Summary List all restaurants
// @Description Get a list of restaurants with optional filtering parameters
// @Tags restaurants
// @Accept json
// @Produce json
// @Param city query string false "Filter by city"
// @Param status query string false "Filter by restaurant status"
// @Param owner_id query string false "Filter by owner ID"
// @Param sort query string false "Sort field"
// @Param limit query int false "Limit number of results"
// @Param offset query int false "Offset for pagination"
// @Success 200 {array} dtos.RestaurantResponse "List of restaurants"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /restaurants [get]
func (h *restaurantHandler) List(c *gin.Context) {
	filter := h.buildRestaurantFilter(c)

	restaurants, err := h.restaurantUseCase.List(c.Request.Context(), filter)
	if err != nil {
		log.Printf("Error in RestaurantHandler.List: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, restaurants)
}

// Search searches restaurants with advanced filtering
// @Summary Search restaurants
// @Description Search restaurants with advanced filtering and pagination
// @Tags restaurants
// @Accept json
// @Produce json
// @Param query query string false "Text search query"
// @Param city query string false "Filter by city"
// @Param district query string false "Filter by district"
// @Param min_rating query number false "Minimum rating filter"
// @Param max_delivery query number false "Maximum delivery fee filter"
// @Param min_order query number false "Minimum order amount filter"
// @Param max_prep_time query integer false "Maximum preparation time filter"
// @Param cuisines query string false "Comma-separated list of cuisines"
// @Param sort_by query string false "Sort field (rating, delivery_fee, prep_time, name)"
// @Param sort_order query string false "Sort order (asc, desc)"
// @Param page query integer false "Page number for pagination"
// @Param page_size query integer false "Number of items per page"
// @Success 200 {object} dtos.RestaurantSearchResult "Search results with pagination"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /restaurants/search [get]
func (h *restaurantHandler) Search(c *gin.Context) {
	filter := h.buildRestaurantFilter(c)

	result, err := h.restaurantUseCase.Search(c.Request.Context(), filter)
	if err != nil {
		log.Printf("Error in RestaurantHandler.Search: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// Helper function to build filter from query parameters
func (h *restaurantHandler) buildRestaurantFilter(c *gin.Context) *repository.RestaurantFilter {
	filter := &repository.RestaurantFilter{}

	// Basic filters
	if city := c.Query("city"); city != "" {
		filter.City = &city
	}
	if status := c.Query("status"); status != "" {
		s := domain.RestaurantStatus(status)
		filter.Status = &s
	}
	if ownerID := c.Query("owner_id"); ownerID != "" {
		filter.OwnerID = &ownerID
	}
	if sort := c.Query("sort"); sort != "" {
		filter.Sort = &sort
	}

	// New search filters
	filter.Query = c.Query("query") // Text search

	if district := c.Query("district"); district != "" {
		filter.District = &district
	}

	if minRatingStr := c.Query("min_rating"); minRatingStr != "" {
		if minRating, err := strconv.ParseFloat(minRatingStr, 64); err == nil {
			filter.MinRating = &minRating
		}
	}

	if maxDeliveryStr := c.Query("max_delivery"); maxDeliveryStr != "" {
		if maxDelivery, err := strconv.ParseFloat(maxDeliveryStr, 64); err == nil {
			filter.MaxDelivery = &maxDelivery
		}
	}

	if minOrderStr := c.Query("min_order"); minOrderStr != "" {
		if minOrder, err := strconv.ParseFloat(minOrderStr, 64); err == nil {
			filter.MinOrder = &minOrder
		}
	}

	if maxPrepTimeStr := c.Query("max_prep_time"); maxPrepTimeStr != "" {
		if maxPrepTime, err := strconv.ParseUint(maxPrepTimeStr, 10, 8); err == nil {
			prepTime := uint8(maxPrepTime)
			filter.MaxPrepTime = &prepTime
		}
	}

	// Cuisines filter (comma-separated)
	if cuisinesStr := c.Query("cuisines"); cuisinesStr != "" {
		cuisines := strings.Split(cuisinesStr, ",")
		for i, cuisine := range cuisines {
			cuisines[i] = strings.TrimSpace(cuisine)
		}
		filter.Cuisines = cuisines
	}

	// New sorting options
	filter.SortBy = c.Query("sort_by")       // rating, delivery_fee, prep_time, name
	filter.SortOrder = c.Query("sort_order") // asc, desc

	// Pagination
	if pageStr := c.Query("page"); pageStr != "" {
		if page, err := strconv.Atoi(pageStr); err == nil && page > 0 {
			filter.Page = page
		}
	}
	if pageSizeStr := c.Query("page_size"); pageSizeStr != "" {
		if pageSize, err := strconv.Atoi(pageSizeStr); err == nil && pageSize > 0 {
			filter.PageSize = pageSize
		}
	}

	// Legacy pagination support
	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil {
			filter.Limit = limit
		}
	}
	if offsetStr := c.Query("offset"); offsetStr != "" {
		if offset, err := strconv.Atoi(offsetStr); err == nil {
			filter.Offset = offset
		}
	}

	return filter
}

// ListCampaigns returns all campaigns
// @Summary List all campaigns
// @Description Get a list of all active campaigns
// @Tags campaigns
// @Accept json
// @Produce json
// @Success 200 {array} dtos.CampaignResponse "List of campaigns"
// @Router /campaigns [get]
func (h *restaurantHandler) ListCampaigns(c *gin.Context) {
	campaigns, err := h.restaurantUseCase.ListCampaigns(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, campaigns)
}

// CreateCampaign creates a new campaign
// @Summary Create a new campaign
// @Description Create a new campaign (discount) and send notification
// @Tags campaigns
// @Accept json
// @Produce json
// @Param campaign body dtos.CampaignCreateRequest true "Campaign creation data"
// @Success 201 {object} map[string]string "Campaign created successfully"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /campaigns [post]
func (h *restaurantHandler) CreateCampaign(c *gin.Context) {
	var req dtos.CampaignCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.restaurantUseCase.CreateCampaign(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Campaign created successfully"})
}
