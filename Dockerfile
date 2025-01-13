# Started with the official Go image based on Alpine Linux for a lightweight build environment
FROM golang:1.22.10-alpine AS builder

# Set the working directory inside the container to /app
WORKDIR /app

# Copied the Go module files (go.mod and go.sum) into the container
COPY go.mod go.sum ./

# Downloaded and cached all the dependencies listed in go.mod
RUN go mod download

# Copied the rest of the application code into the container
COPY . .

# Built the Go application. Disabled CGO for a static binary and specified the output file as /app/foodApp
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/foodApp ./cmd/server

# Started a new stage using a minimal Alpine Linux image for the final container
FROM alpine:latest

# Set the working directory inside the container to /app
WORKDIR /app

# Copied the built binary from the builder stage into the final container
COPY --from=builder /app/foodApp /app/foodApp

# Exposed port 8080 so the application could be accessed from outside the container
EXPOSE 8080

# Defined the command to run the application when the container started
CMD ["./foodApp"]