package main

import (
	"auth/config"
	"auth/docs"
	"auth/internal/handler"
	"auth/internal/infra/db"
	"auth/internal/infra/kafka"
	"auth/internal/infra/redis"
	"auth/internal/middleware"
	"auth/internal/repository"
	"auth/internal/routes"
	"auth/internal/usecase"
	"auth/pkg/cron"
	"auth/pkg/logs"
	"auth/pkg/security"
	"context"
	"time"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Lezzet Limanı Auth Service API
// @version 1.0.0
// @description Authentication and authorization service for Lezzet Limanı platform
// @host lezzetlimani.site
// @BasePath /auth
// @schemes https http
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description JWT Authorization header using the Bearer scheme
// @x-cors-allowed-origins ["https://lezzetlimani-lime.vercel.app", "https://lezzetlimani.site", "http://localhost:3000"]
// @x-cors-allowed-methods ["GET","POST","PUT","DELETE","OPTIONS"]
// @x-cors-allowed-headers ["Content-Type","Authorization","X-Requested-With","Accept"]
// @x-cors-allow-credentials true
func Run() error {
	logs.Init(true)
	defer logs.Sync()

	cfg := config.GetConfig()
	ctx := context.Background()

	// Setup dependencies
	db, err := db.NewDB()
	if err != nil {
		return err
	}
	redisClient, err := redis.NewRedisClient()
	if err != nil {
		return err
	}
	redisService := redis.NewRedisService(*redisClient)
	jwt := security.NewJWTService()
	kafkaPublisher := kafka.NewKafkaPublisher()

	// Setup services
	authRepo := repository.NewAuthRepository(db)
	authUsecase := usecase.NewAuthUsecase(*redisClient, authRepo, jwt, kafkaPublisher, redisService)
	authHandler := handler.NewAuthHandler(authUsecase)

	// Start cron job
	cron.StartExpiredTokenCleanup(ctx, *redisClient, authRepo, 1*time.Minute)

	// Setup router
	r := gin.Default()
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = false
	r.Use(middleware.RequestContextMiddleware())

	// Setup routes
	routes.RegisterRoutes(r, authHandler, jwt, redisService)

	// Setup Swagger
	docs.SwaggerInfo.BasePath = "/auth"
	r.GET("/auth/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	return r.Run(":" + cfg.ServerConfig.Port)
}
