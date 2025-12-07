package main

import (
	"fmt"
	"log"
	"net/http"
	"retail-tool-backend/internal/api"

	"retail-tool-backend/internal/middleware"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	_ "retail-tool-backend/docs"

	httpSwagger "github.com/swaggo/http-swagger"
)

// @title           Retail Media Compliance API
// @version         1.0
// @description     AI-Driven Creative Compliance Engine implementing Tesco Guidelines.
// @host            localhost:8080
// @BasePath        /
func main() {
	//Initialize Structured Logger
	middleware.InitializeLogger()

	r := mux.NewRouter()

	//Register Middleware (This wraps all routes below it)
	r.Use(middleware.RequestLogger)

	// Upload API
	r.HandleFunc("/api/upload", api.UploadHandler).Methods("POST")

	//Serve Static Files (so http://localhost:8080/uploads/image.jpg works)
	// This maps the URL path "/uploads/" to the local directory "./uploads"
	fileServer := http.FileServer(http.Dir("./uploads"))
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", fileServer))

	// Register Routes
	r.HandleFunc("/api/validate", api.ValidateHandler).Methods("POST")
	r.HandleFunc("/health", api.HealthCheck).Methods("GET")

	// Swagger Docs Route
	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// CORS Configuration (Allow React Frontend)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)
	port := ":8080"

	fmt.Printf("Backend Rule Engine running on port %s\n", port)
	fmt.Printf("Swagger UI available at http://localhost%s/swagger/index.html\n", port)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}
