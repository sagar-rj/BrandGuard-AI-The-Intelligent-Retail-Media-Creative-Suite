package api

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"retail-tool-backend/internal/compliance"
	"retail-tool-backend/internal/models"
)

// ValidateHandler receives JSON from React and runs the rules

// ValidateHandler godoc
// @Summary      Validate Creative Compliance
// @Description  Checks creative elements against Appendix B rules (Text, Alcohol, Safe Zones)
// @Tags         compliance
// @Accept       json
// @Produce      json
// @Param        creative body models.CreativeRequest true "Creative JSON Data"
// @Success      200  {object}  models.ValidationResponse
// @Failure      400  {string}  string "Invalid request payload"
// @Router       /api/validate [post]
func ValidateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var request models.CreativeRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		slog.Error("Failed to decode JSON body", slog.String("error", err.Error()))
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Log the incoming validation attempt
	slog.Info("Validating Creative",
		slog.String("format", request.Format),
		slog.String("category", request.Category),
		slog.Int("element_count", len(request.Elements)),
	)

	// Run the engine
	result := compliance.ValidateCreative(request)

	// Log the result
	if !result.Valid {
		slog.Warn("Validation Failed",
			slog.Int("error_count", len(result.Errors)),
			slog.Any("errors", result.Errors),
		)
	} else {
		slog.Info("Validation Passed")
	}

	json.NewEncoder(w).Encode(result)
}

// HealthCheck for testing connectivity

// HealthCheck godoc
// @Summary      Backend Health Check
// @Description  Verifies that the API server is running
// @Tags         system
// @Success      200  {string}  string "Backend is running"
// @Router       /health [get]
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	slog.Debug("Health check pinged")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Backend is running"))
}
