package address

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	baseURL    string
	httpClient *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type Address struct {
	ID          string   `json:"id"`
	EntityID    string   `json:"entity_id"`
	EntityType  string   `json:"entity_type"`
	Title       string   `json:"title"`
	Address     string   `json:"address"`
	City        string   `json:"city"`
	District    string   `json:"district"`
	FullAddress string   `json:"full_address"`
	ZipCode     string   `json:"zip_code"`
	Apartment   *string  `json:"apartment"`
	Floor       *string  `json:"floor"`
	DoorNumber  *string  `json:"door_number"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
	IsDefault   bool     `json:"is_default"`
	CreatedAt   string   `json:"created_at"`
	UpdatedAt   string   `json:"updated_at"`
}

func (c *Client) GetAddress(ctx context.Context, id string) (*Address, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/addresses/%s", c.baseURL, id), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var address Address
	if err := json.NewDecoder(resp.Body).Decode(&address); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &address, nil
}
