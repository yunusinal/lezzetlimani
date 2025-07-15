package dtos

// OpeningHoursDTO örnek: {"mon":"09:00-22:00","tue":"09:00-22:00"}
type OpeningHoursDTO map[string]string

// AddressResponse represents an address response from the address service
type AddressResponse struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Address     string   `json:"address"`
	City        string   `json:"city"`
	District    string   `json:"district"`
	FullAddress string   `json:"full_address"`
	ZipCode     string   `json:"zip_code"`
	Apartment   *string  `json:"apartment,omitempty"`
	Floor       *string  `json:"floor,omitempty"`
	DoorNumber  *string  `json:"door_number,omitempty"`
	Latitude    *float64 `json:"latitude,omitempty"`
	Longitude   *float64 `json:"longitude,omitempty"`
}

// CreateRestaurantRequest  godoc
//
//	@Description	Yeni restoran oluşturma gövdesi
type CreateRestaurantRequest struct {
	Name         string          `json:"name"          example:"Kebapçı Halil Usta" validate:"required,min=3,max=128"`
	Description  string          `json:"description"   example:"Meşhur Adana kebap" validate:"required,min=3,max=1024"`
	Logo         string          `json:"logo"          example:"https://cdn.site/halil.png" validate:"required,url"`
	PhoneNumber  string          `json:"phone_number"  example:"+90 212 000 00 00" validate:"required,min=10,max=16"`
	Email        string          `json:"email"         example:"info@halilusta.com" validate:"required,email"`
	Status       string          `json:"status"        example:"closed"              validate:"required,oneof=open closed"`
	OpeningHours OpeningHoursDTO `json:"opening_hours"                                                 validate:"required,dive,keys,printascii,endkeys,required"`
	PrepTimeMin  uint8           `json:"prep_time_min" example:"20"                  validate:"required,min=0,max=240"`
	DeliveryFee  float64         `json:"delivery_fee"  example:"29.90"               validate:"required,gte=0"`
	MinOrder     float64         `json:"min_order"     example:"120.00"              validate:"required,gte=0"`
	AddressID    string          `json:"address_id"      validate:"required,dive"`
}

// RestaurantResponse  godoc
type RestaurantResponse struct {
	ID        string           `json:"id"          example:"a1b2c3d4-..." `
	Name      string           `json:"name"        example:"Kebapçı Halil Usta"`
	Logo      string           `json:"logo"        example:"https://cdn.site/halil.png"`
	Status    string           `json:"status"      example:"open"`
	PrepTime  uint16           `json:"prep_time"`
	RatingAvg float32          `json:"rating_avg"  example:"4.7"`
	AddressID string           `json:"address_id"`
	Address   *AddressResponse `json:"address,omitempty"`
	CreatedAt string           `json:"created_at"  example:"2025-05-26T10:00:00Z"`
}

// RestaurantSearchResultDTO for search endpoint responses
type RestaurantSearchResultDTO struct {
	Restaurants []*RestaurantResponse `json:"restaurants"`
	Total       int64                 `json:"total"`
	Page        int                   `json:"page"`
	PageSize    int                   `json:"page_size"`
	HasNext     bool                  `json:"has_next"`
}

// RestaurantListResponse  godoc
type RestaurantListResponse struct {
	Restaurants []*RestaurantResponse `json:"restaurants"`
	Total       int                   `json:"total"     example:"125"`
	Page        int                   `json:"page"      example:"1"`
	PageSize    int                   `json:"page_size" example:"20"`
}

// UpdateRestaurantRequest  godoc
type UpdateRestaurantRequest struct {
	// Only fields that can change: (partial update)
	Name         *string          `json:"name,omitempty"          example:"Yeni İsim"          validate:"omitempty,min=3,max=128"`
	Description  *string          `json:"description,omitempty"   example:"Yeni açıklama"      validate:"omitempty,min=3,max=1024"`
	Logo         *string          `json:"logo,omitempty"          example:"https://cdn.site/..." validate:"omitempty,url"`
	Status       *string          `json:"status,omitempty"        example:"open"               validate:"omitempty,oneof=open closed"`
	OpeningHours *OpeningHoursDTO `json:"opening_hours,omitempty"                                   validate:"omitempty,dive,keys,printascii,endkeys,required"`
	PrepTimeMin  *uint16          `json:"prep_time_min,omitempty" example:"15"                  validate:"omitempty,min=0,max=240"`
	DeliveryFee  *float64         `json:"delivery_fee,omitempty"  example:"19.90"               validate:"omitempty,gte=0"`
	MinOrder     *float64         `json:"min_order,omitempty"     example:"80.00"               validate:"omitempty,gte=0"`
	AddressID    *string          `json:"address_id,omitempty"                                      validate:"omitempty,dive"`
}

// CampaignResponse represents a campaign response from the campaign service
type CampaignResponse struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	RestaurantID string `json:"restaurant_id"`
}

type CampaignListResponse struct {
	Campaigns []CampaignResponse `json:"campaigns"`
}

type CampaignCreateRequest struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	RestaurantID string `json:"restaurant_id"`
}
