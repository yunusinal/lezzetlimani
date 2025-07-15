#!/bin/bash

# Install Swagger CLI if not installed
if ! command -v swag &> /dev/null; then
    echo "Installing Swagger CLI..."
    go install github.com/swaggo/swag/cmd/swag@latest
fi

# Install required dependencies
echo "Installing Swagger dependencies..."
go get github.com/swaggo/files
go get github.com/swaggo/gin-swagger
go get github.com/swaggo/swag

# Generate Swagger documentation
echo "Generating Swagger documentation..."
cd "$(dirname "$0")/.."
swag init -g cmd/server.go -o docs

# Update go.mod
go mod tidy

echo "Swagger documentation generated successfully!"
echo "Now uncomment the Swagger imports and routes in cmd/server.go"
echo "API documentation will be available at: http://localhost:8084/swagger/index.html" 