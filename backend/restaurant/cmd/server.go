package main

import (
	"log"
	"restaurant/config"
	"restaurant/internal/handler"
	"restaurant/internal/repository"
	"restaurant/internal/usecase"
	"restaurant/pkg/address"
	"restaurant/pkg/db"
	"restaurant/pkg/kafka"
	"restaurant/test"

	"github.com/gin-gonic/gin"
)

// @title Restaurant Service API
// @version 1.0
// @description Restaurant service for food delivery platform
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8084
// @BasePath /
// @schemes http https

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	return &Server{router: gin.Default()}
}

func (s *Server) Run() {
	cfg := config.GetConfig()

	db, err := db.NewDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if cfg.MockConfig.Enabled {
		test.InsertMockRestaurants(db)
	}

	addressClient := address.NewClient(cfg.AddressServiceConfig.URL)
	restaurantRepo := repository.NewRestaurantRepository(db)

	// Kafka publisher setup
	kafkaBrokers := []string{"kafka:9092"} // veya cfg'den al
	kafkaTopic := "notification"           // notification servisi ile uyumlu olmalı
	publisher := kafka.NewPublisher(kafkaBrokers, kafkaTopic)

	restaurantUseCase := usecase.NewRestaurantUseCase(restaurantRepo, addressClient, publisher)

	s.SetupRoutes(restaurantUseCase)
	s.router.SetTrustedProxies([]string{"127.0.0.1"})
	s.router.Run(":" + cfg.ServerConfig.Port)
}

func (s *Server) SetupRoutes(restaurantUseCase usecase.RestaurantUseCase) {
	restaurantHandler := handler.NewRestaurantHandler(restaurantUseCase)

	// TODO: Enable Swagger endpoint after installing dependencies
	// s.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Restaurant routes
	s.router.POST("/restaurants", restaurantHandler.Create)
	s.router.GET("/restaurants/:id", restaurantHandler.GetByID)
	s.router.GET("/restaurants", restaurantHandler.List)
	s.router.GET("/restaurants/search", restaurantHandler.Search)
	s.router.GET("/campaigns", restaurantHandler.ListCampaigns)
	s.router.POST("/campaigns", restaurantHandler.CreateCampaign)
}
