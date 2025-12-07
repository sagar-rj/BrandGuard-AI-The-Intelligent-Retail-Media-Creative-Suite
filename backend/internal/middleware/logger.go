package middleware

import (
	"log/slog"
	"net/http"
	"os"
	"time"
)

// InitializeLogger sets up the global logger configuration
func InitializeLogger() {
	// Use JSON handler for structured logs (great for production/cloud tools)
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)
}

// statusRecorder wraps ResponseWriter to capture the status code
type statusRecorder struct {
	http.ResponseWriter
	Status int
}

func (r *statusRecorder) WriteHeader(status int) {
	r.Status = status
	r.ResponseWriter.WriteHeader(status)
}

// RequestLogger is the middleware function
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap the writer to capture status code
		recorder := &statusRecorder{ResponseWriter: w, Status: http.StatusOK}

		// Process request
		next.ServeHTTP(recorder, r)

		// Log the details
		slog.Info("Incoming Request",
			slog.String("method", r.Method),
			slog.String("path", r.URL.Path),
			slog.Int("status", recorder.Status),
			slog.String("duration", time.Since(start).String()),
			slog.String("ip", r.RemoteAddr),
		)
	})
}
