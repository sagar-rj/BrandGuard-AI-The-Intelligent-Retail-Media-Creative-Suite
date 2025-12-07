package compliance

import (
	"fmt"
	"retail-tool-backend/internal/models"
	"strings"
)

// CheckTextRules enforces copy restrictions found in Appendix B.
// Source: Self-serve guidelines (Copy Rules)
func CheckTextRules(elements []models.Element) []string {
	var errors []string

	// Map of prohibited words to their specific rejection reasons.
	bannedPhrases := map[string]string{
		"win":          "Competitions are not allowed",
		"competition":  "Competitions are not allowed",
		"guarantee":    "Money-back guarantees are not allowed",
		"eco-friendly": "Green/Sustainability claims are not allowed",
		"sustainable":  "Green/Sustainability claims are not allowed",
		"discount":     "Price/Discount call-outs are not allowed",
		"save":         "Price/Discount call-outs are not allowed",
	}

	for _, el := range elements {
		if el.Type == "Text" {
			// Normalize to lowercase for case-insensitive matching
			text := strings.ToLower(el.Content)

			for phrase, reason := range bannedPhrases {
				if strings.Contains(text, phrase) {
					// Formats error message: "Hard Fail: Found 'win'. Competitions are not allowed"
					errors = append(errors, fmt.Sprintf("Hard Fail: Found '%s'. %s", phrase, reason))
				}
			}
		}
	}
	return errors
}

// CheckAlcoholRules enforces mandatory disclaimers for Alcohol category.
// Source: Tesco Guideline (Alcohol)
func CheckAlcoholRules(category string, elements []models.Element) []string {
	// If category is not Alcohol, skip these rules
	if category != "Alcohol" {
		return nil
	}

	hasLockup := false
	var errors []string

	for _, el := range elements {
		if el.Type == "Drinkaware" {
			hasLockup = true
			// Rule: SAYS override requires minimum 12px height
			if el.Height < 12 {
				errors = append(errors, fmt.Sprintf("Hard Fail: Drinkaware lock-up is too small (%dpx). Min height is 12px.", el.Height))
			}
		}
	}

	// Rule: All alcohol campaigns must include the Drinkaware lock-up
	if !hasLockup {
		errors = append(errors, "Hard Fail: Missing mandatory Drinkaware lock-up")
	}

	return errors
}

// CheckSafeZones enforces geometry limits for social formats.
// Source: Tesco Guideline (Format/Social)
func CheckSafeZones(format string, elements []models.Element) []string {
	var errors []string

	// Logic for "Facebook and Instagram Stories 1080x1920 px"
	if format == "Story_9x16" {
		safeTop := 200           // Rule: Top 200px must be free of text/logos
		safeBottom := 1920 - 250 // Rule: Bottom 250px must be free of text/logos

		for _, el := range elements {
			// Rule applies to Text, Logo, and ValueTile elements
			if el.Type == "Text" || el.Type == "Logo" || el.Type == "ValueTile" {
				// Check Top Zone violation
				if el.Y < safeTop {
					errors = append(errors, fmt.Sprintf("Hard Fail: Element '%s' violates Top Safe Zone (0-200px)", el.Type))
				}

				// Check Bottom Zone violation (Y + Height calculates the bottom edge)
				if (el.Y + el.Height) > safeBottom {
					errors = append(errors, fmt.Sprintf("Hard Fail: Element '%s' violates Bottom Safe Zone (Bottom 250px)", el.Type))
				}
			}
		}
	}
	return errors
}
