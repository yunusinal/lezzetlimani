package usecase

import (
	"context"
	"fmt"
	"log"
	"restaurant/internal/contextkeys"
	"restaurant/internal/domain"
	"restaurant/internal/dtos"
	"restaurant/internal/repository"
	"restaurant/pkg/address"
	"restaurant/pkg/kafka"
	"restaurant/pkg/utils"
	"time"
)

type restaurantUseCase struct {
	restaurantRepo repository.RestaurantRepository
	addressClient  *address.Client
	publisher      *kafka.Publisher
}

func NewRestaurantUseCase(restaurantRepo repository.RestaurantRepository, addressClient *address.Client, publisher *kafka.Publisher) RestaurantUseCase {
	return &restaurantUseCase{
		restaurantRepo: restaurantRepo,
		addressClient:  addressClient,
		publisher:      publisher,
	}
}

func (u *restaurantUseCase) Create(ctx context.Context, rest *dtos.CreateRestaurantRequest) error {

	id, _ := utils.GenerateUUID()
	now := time.Now()

	restaurant := &domain.Restaurant{
		ID:            id,
		OwnerID:       ctx.Value(contextkeys.UserIDKey).(string),
		Name:          rest.Name,
		Description:   rest.Description,
		Logo:          rest.Logo,
		PhoneNumber:   rest.PhoneNumber,
		Email:         rest.Email,
		Status:        domain.RestaurantStatus(rest.Status),
		OpeningHours:  domain.OpeningHours(rest.OpeningHours),
		PrepTime:      rest.PrepTimeMin,
		DeliveryFee:   rest.DeliveryFee,
		MinOrderPrice: rest.MinOrder,
		RatingAvg:     0,
		RatingCount:   0,
		CreatedAt:     now,
		UpdatedAt:     now,
		AddressID:     id,
	}

	if err := u.restaurantRepo.Create(ctx, restaurant); err != nil {
		return err
	}
	return nil
}

func (u *restaurantUseCase) GetByID(ctx context.Context, id string) (*dtos.RestaurantResponse, error) {
	restaurant, err := u.restaurantRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	addr, err := u.addressClient.GetAddress(ctx, restaurant.AddressID)
	if err != nil {
		return nil, err
	}

	return &dtos.RestaurantResponse{
		ID:        restaurant.ID,
		Name:      restaurant.Name,
		Logo:      restaurant.Logo,
		Status:    string(restaurant.Status),
		PrepTime:  uint16(restaurant.PrepTime),
		RatingAvg: float32(restaurant.RatingAvg),
		AddressID: restaurant.AddressID,
		Address: &dtos.AddressResponse{
			ID:          addr.ID,
			Title:       addr.Title,
			Address:     addr.Address,
			City:        addr.City,
			District:    addr.District,
			FullAddress: addr.FullAddress,
			ZipCode:     addr.ZipCode,
			Apartment:   addr.Apartment,
			Floor:       addr.Floor,
			DoorNumber:  addr.DoorNumber,
			Latitude:    addr.Latitude,
			Longitude:   addr.Longitude,
		},
		CreatedAt: restaurant.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (u *restaurantUseCase) List(ctx context.Context, filter *repository.RestaurantFilter) ([]*dtos.RestaurantResponse, error) {
	restaurants, err := u.restaurantRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	responses := make([]*dtos.RestaurantResponse, len(restaurants))

	for i, restaurant := range restaurants {
		addr, err := u.addressClient.GetAddress(ctx, restaurant.AddressID)
		if err != nil {
			log.Printf("failed to fetch address for ID %s: %v", restaurant.AddressID, err)
			return nil, fmt.Errorf("address service error: %w", err)
		}

		responses[i] = &dtos.RestaurantResponse{
			ID:        restaurant.ID,
			Name:      restaurant.Name,
			Logo:      restaurant.Logo,
			Status:    string(restaurant.Status),
			PrepTime:  uint16(restaurant.PrepTime),
			RatingAvg: float32(restaurant.RatingAvg),
			AddressID: restaurant.AddressID,
			Address: &dtos.AddressResponse{
				ID:          addr.ID,
				Title:       addr.Title,
				Address:     addr.Address,
				City:        addr.City,
				District:    addr.District,
				FullAddress: addr.FullAddress,
				ZipCode:     addr.ZipCode,
				Apartment:   addr.Apartment,
				Floor:       addr.Floor,
				DoorNumber:  addr.DoorNumber,
				Latitude:    addr.Latitude,
				Longitude:   addr.Longitude,
			},
			CreatedAt: restaurant.CreatedAt.Format(time.RFC3339),
		}
	}
	return responses, nil
}

func (u *restaurantUseCase) Search(ctx context.Context, filter *repository.RestaurantFilter) (*dtos.RestaurantSearchResultDTO, error) {
	searchResult, err := u.restaurantRepo.Search(ctx, filter)
	if err != nil {
		return nil, err
	}

	// Convert domain restaurants to DTOs for the response
	responses := make([]*dtos.RestaurantResponse, len(searchResult.Restaurants))

	for i, restaurant := range searchResult.Restaurants {
		// Try to get address info, but don't fail the whole search if one address fails
		var addressResponse *dtos.AddressResponse
		if addr, err := u.addressClient.GetAddress(ctx, restaurant.AddressID); err == nil {
			addressResponse = &dtos.AddressResponse{
				ID:          addr.ID,
				Title:       addr.Title,
				Address:     addr.Address,
				City:        addr.City,
				District:    addr.District,
				FullAddress: addr.FullAddress,
				ZipCode:     addr.ZipCode,
				Apartment:   addr.Apartment,
				Floor:       addr.Floor,
				DoorNumber:  addr.DoorNumber,
				Latitude:    addr.Latitude,
				Longitude:   addr.Longitude,
			}
		} else {
			log.Printf("failed to fetch address for restaurant ID %s: %v", restaurant.ID, err)
			// Continue without address info rather than failing the entire search
		}

		responses[i] = &dtos.RestaurantResponse{
			ID:        restaurant.ID,
			Name:      restaurant.Name,
			Logo:      restaurant.Logo,
			Status:    string(restaurant.Status),
			PrepTime:  uint16(restaurant.PrepTime),
			RatingAvg: float32(restaurant.RatingAvg),
			AddressID: restaurant.AddressID,
			Address:   addressResponse,
			CreatedAt: restaurant.CreatedAt.Format(time.RFC3339),
		}
	}

	// Create a new search result with DTO responses
	return &dtos.RestaurantSearchResultDTO{
		Restaurants: responses,
		Total:       searchResult.Total,
		Page:        searchResult.Page,
		PageSize:    searchResult.PageSize,
		HasNext:     searchResult.HasNext,
	}, nil
}

func (u *restaurantUseCase) ListCampaigns(ctx context.Context) ([]*dtos.CampaignResponse, error) {
	campaigns, err := u.restaurantRepo.ListCampaigns(ctx)
	if err != nil {
		return nil, err
	}
	var resp []*dtos.CampaignResponse
	for _, c := range campaigns {
		resp = append(resp, &dtos.CampaignResponse{
			ID:           c.ID,
			Title:        c.Title,
			Description:  c.Description,
			StartDate:    c.StartDate.Format(time.RFC3339),
			EndDate:      c.EndDate.Format(time.RFC3339),
			RestaurantID: c.RestaurantID,
		})
	}
	return resp, nil
}

func (u *restaurantUseCase) CreateCampaign(ctx context.Context, req *dtos.CampaignCreateRequest) error {
	id, _ := utils.GenerateUUID()
	start, _ := time.Parse(time.RFC3339, req.StartDate)
	end, _ := time.Parse(time.RFC3339, req.EndDate)
	campaign := &domain.Campaign{
		ID:           id,
		Title:        req.Title,
		Description:  req.Description,
		StartDate:    start,
		EndDate:      end,
		RestaurantID: req.RestaurantID,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	if err := u.restaurantRepo.CreateCampaign(ctx, campaign); err != nil {
		return err
	}
	// Notification event (Kafka)
	if u.publisher != nil {
		event := kafka.NotificationEvent{
			Type:     "discount",
			To:       "all",
			Subject:  "Yeni İndirim!",
			Template: "discount",
			Variables: map[string]string{
				"title":       req.Title,
				"description": req.Description,
			},
		}
		err := u.publisher.Publish(ctx, event)
		if err != nil {
			log.Printf("Failed to publish notification event: %v", err)
		}
	}
	return nil
}
