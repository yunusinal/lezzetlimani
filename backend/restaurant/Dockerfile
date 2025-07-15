FROM golang:1.23.3-alpine

WORKDIR /app

RUN apk add --no-cache git curl

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY . .

RUN go build -o restaurant ./cmd

EXPOSE 8084

CMD ["./restaurant"]