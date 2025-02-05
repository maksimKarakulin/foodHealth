package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port               string
	DatabaseURL        string
	JWTSecret          string
	Environment        string
	ServerReadTimeout  time.Duration
	ServerWriteTimeout time.Duration
	ServerIdleTimeout  time.Duration
	ServerShutdownTimeout time.Duration
}

const (
	defaultPort               = "8080"
	defaultEnvironment        = "development"
	defaultServerReadTimeout  = 5 * time.Second
	defaultServerWriteTimeout = 10 * time.Second
	defaultServerIdleTimeout  = 120 * time.Second
	defaultServerShutdownTimeout = 30 * time.Second
)

func Load() *Config {
	port := getEnvOrDefault("PORT", defaultPort)
	databaseURL := os.Getenv("DATABASE_URL")
	jwtSecret := os.Getenv("JWT_SECRET")
	environment := getEnvOrDefault("ENVIRONMENT", defaultEnvironment)

	serverReadTimeout := getEnvDurationOrDefault("SERVER_READ_TIMEOUT", defaultServerReadTimeout)
	serverWriteTimeout := getEnvDurationOrDefault("SERVER_WRITE_TIMEOUT", defaultServerWriteTimeout)
	serverIdleTimeout := getEnvDurationOrDefault("SERVER_IDLE_TIMEOUT", defaultServerIdleTimeout)
	serverShutdownTimeout := getEnvDurationOrDefault("SERVER_SHUTDOWN_TIMEOUT", defaultServerShutdownTimeout)


	if databaseURL == "" {
		panic("DATABASE_URL environment variable is required")
	}
	if jwtSecret == "" {
		panic("JWT_SECRET environment variable is required")
	}

	return &Config{
		Port:               port,
		DatabaseURL:        databaseURL,
		JWTSecret:          jwtSecret,
		Environment:        environment,
		ServerReadTimeout:  serverReadTimeout,
		ServerWriteTimeout: serverWriteTimeout,
		ServerIdleTimeout:  serverIdleTimeout,
		ServerShutdownTimeout: serverShutdownTimeout,
	}
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvDurationOrDefault(key string, defaultValue time.Duration) time.Duration {
	envValue := os.Getenv(key)
	if envValue == "" {
		return defaultValue
	}
	duration, err := time.ParseDuration(envValue)
	if err != nil {
		return defaultValue
	}
	return duration
}

func getEnvIntOrDefault(key string, defaultValue int) int {
	envValue := os.Getenv(key)
	if envValue == "" {
		return defaultValue
	}
	intValue, err := strconv.Atoi(envValue)
	if err != nil {
		return defaultValue
	}
	return intValue
}
