package compliance

import "retail-tool-backend/internal/models"

func ValidateCreative(req models.CreativeRequest) models.ValidationResponse {
	response := models.ValidationResponse{
		Valid:    true,
		Errors:   []string{},
		Warnings: []string{},
	}

	// 1. Run Text Checks
	if errs := CheckTextRules(req.Elements); len(errs) > 0 {
		response.Errors = append(response.Errors, errs...)
		response.Valid = false
	}

	// 2. Run Alcohol Checks
	if errs := CheckAlcoholRules(req.Category, req.Elements); len(errs) > 0 {
		response.Errors = append(response.Errors, errs...)
		response.Valid = false
	}

	// 3. Run Safe Zone Checks
	if errs := CheckSafeZones(req.Format, req.Elements); len(errs) > 0 {
		response.Errors = append(response.Errors, errs...)
		response.Valid = false
	}

	return response
}
