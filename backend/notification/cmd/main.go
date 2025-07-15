package main

import (
	"context"
	"log"
	"net/http"
	"notification/pkg/configs"
	"notification/pkg/handlers"
	"notification/pkg/kafka"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("🚀 Notification Service starting...")

	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatalf("❌ Error loading config: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Gin router setup
	r := gin.Default()

	// Configure CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"https://lezzetlimani-lime.vercel.app", "https://lezzetlimani.site", "http://localhost:3000"}
	corsConfig.AllowCredentials = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}
	r.Use(cors.New(corsConfig))

	// Set trusted proxies to localhost only
	r.SetTrustedProxies([]string{"127.0.0.1"})

	notificationGroup := r.Group("/notification")
	{
		notificationGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "OK"})
		})
		notificationGroup.GET("/types", handlers.GetNotificationTypes)
		notificationGroup.POST("/send", handlers.SendNotification)
	}

	// Start HTTP server in background
	go func() {
		log.Printf("🌐 HTTP server starting on port %s", config.Server.Port)
		if err := r.Run(":" + config.Server.Port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("❌ Failed to run HTTP server: %v", err)
		}
	}()

	// Kafka consumer
	var wg sync.WaitGroup
	done := make(chan os.Signal, 1)
	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)

	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Println("✅ Kafka consumer initialized. Listening on topic:", config.Kafka.Topic.EmailEvent)
		kafka.StartEmailEventConsumer(ctx, &config.Kafka)

	}()

	<-done
	log.Println("🛑 Shutting down gracefully...")

	cancel()
	wg.Wait()

	log.Println("✅ Shutdown complete.")
}
