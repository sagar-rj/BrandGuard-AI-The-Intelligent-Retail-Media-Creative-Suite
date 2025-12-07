package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// UploadResponse is what we send back to React
type UploadResponse struct {
	URL      string `json:"url"`
	Filename string `json:"filename"`
}

// UploadHandler godoc
// @Summary      Upload an Image Asset
// @Description  Saves an image (Packshot/Background) to the server
// @Tags         assets
// @Accept       multipart/form-data
// @Produce      json
// @Param        file formData file true "Image File"
// @Success      200  {object}  UploadResponse
// @Failure      400  {string}  string "Bad Request"
// @Router       /api/upload [post]
func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Parse Multipart Form (Max 10MB)
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		slog.Error("Failed to retrieve file", slog.String("error", err.Error()))
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 2. Create Uploads Directory if not exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	// 3. Create a unique filename (timestamp + original name)
	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), handler.Filename)
	filePath := filepath.Join(uploadDir, filename)

	// 4. Save the file
	dst, err := os.Create(filePath)
	if err != nil {
		slog.Error("Failed to create file on disk", slog.String("error", err.Error()))
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	slog.Info("File Uploaded Successfully", slog.String("filename", filename))

	// 5. Return the URL
	// Note: We will configure the router to serve these files at /uploads/
	response := UploadResponse{
		URL:      fmt.Sprintf("http://localhost:8080/uploads/%s", filename),
		Filename: filename,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
