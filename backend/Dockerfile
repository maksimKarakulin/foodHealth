# syntax=docker/dockerfile:1

FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /app/food-health-api ./cmd/server/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/food-health-api /app/food-health-api
COPY --from=builder /app/migrations /app/migrations

EXPOSE 8080

CMD ["/app/food-health-api"]
