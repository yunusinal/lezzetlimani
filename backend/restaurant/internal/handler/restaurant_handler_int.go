package handler

import (
	"github.com/gin-gonic/gin"
)

type RestaurantHandler interface {
	Create(c *gin.Context)
	GetByID(c *gin.Context)
	List(c *gin.Context)
	Search(c *gin.Context)
	ListCampaigns(c *gin.Context)
	CreateCampaign(c *gin.Context)
}
