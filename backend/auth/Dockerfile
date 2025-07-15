FROM golang:1.23.3-alpine

RUN apk add --no-cache git curl

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the application
RUN go build -o auth ./cmd

EXPOSE 8080

CMD ["./auth"]