package models

// Element represents a single item on the canvas (Text, Image, Logo)
type Element struct {
	ID      string `json:"id"`
	Type    string `json:"type"`    // "Logo", "Text", "Packshot", "Drinkaware"
	Content string `json:"content"` // Actual text or image URL
	X       int    `json:"x"`
	Y       int    `json:"y"`
	Width   int    `json:"width"`
	Height  int    `json:"height"`
}

// CreativeRequest is the payload from the frontend
type CreativeRequest struct {
	Format   string    `json:"format"`   // "Story_9x16" or "Banner_Standard"
	Category string    `json:"category"` // "Alcohol", "Standard"
	Elements []Element `json:"elements"`
}

// ValidationResponse sends back pass/fail status and errors
type ValidationResponse struct {
	Valid    bool     `json:"valid"`
	Warnings []string `json:"warnings"`
	Errors   []string `json:"errors"`
}
