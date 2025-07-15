package usecase

import (
	"context"

	"restaurant/internal/dtos"
	"restaurant/internal/repository"
)

type RestaurantUseCase interface {
	Create(ctx context.Context, rest *dtos.CreateRestaurantRequest) error
	GetByID(ctx context.Context, id string) (*dtos.RestaurantResponse, error)
	List(ctx context.Context, filter *repository.RestaurantFilter) ([]*dtos.RestaurantResponse, error)
	Search(ctx context.Context, filter *repository.RestaurantFilter) (*dtos.RestaurantSearchResultDTO, error)
	ListCampaigns(ctx context.Context) ([]*dtos.CampaignResponse, error)
	CreateCampaign(ctx context.Context, req *dtos.CampaignCreateRequest) error
}
