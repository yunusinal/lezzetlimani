# Multi-stage build for Go notification service
FROM golang:1.23.3-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && apk add --no-cache \
    ca-certificates \
    git \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN adduser -D -s /bin/sh -u 1001 appuser

# Build stage
FROM base AS builder

WORKDIR /app

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build with optimizations and security flags
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o notification ./cmd

# Final stage - minimal runtime image
FROM alpine:latest

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN adduser -D -s /bin/sh -u 1001 appuser

WORKDIR /app

# Copy the binary
COPY --from=builder /app/notification .

# Copy environment file if exists
COPY .env* ./

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Use non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8082/notification/health || exit 1

# Expose port
EXPOSE 8082

# Run the binary
CMD ["./notification"]