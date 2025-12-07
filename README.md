# BrandGuard AI: The Intelligent Retail Media Creative Suite

  

**BrandGuard AI** is a next-generation creative builder designed to solve "Compliance Chaos" in retail media. It empowers advertisers to autonomously create professional, brand-safe ad creatives without manual oversight. By merging a **Visual Builder** with a **Real-Time Compliance Engine**, the tool ensures every pixel and every word adheres to strict retailer guidelines (e.g., Tesco Appendix B) before a campaign ever launches.

## 🚀 Key Features

  * **🛡️ Real-Time Compliance Engine (Golang)**
      * **Hard-Fail Enforcement:** Automatically blocks creatives that violate strict rules (e.g., prohibited "Money-back guarantees" or "Sustainability claims").
      * **Mandatory Element Checks:** Enforces presence and minimum size (12px) of elements like the "Drinkaware" lock-up.
  * **🎨 AI-Powered Visual Builder (React.js)**
      * **Safe Zone Visualization:** Overlays dynamic "Red Zones" (200px top / 250px bottom) to strictly enforce Social Story (9:16) constraints. [cite: 31, 97]
      * **Drag-and-Drop:** Intuitive canvas for composing packshots, text, and logos.
  * **🧠 GenAI & Vision Services (Python)**
      * **Auto-Fix Copy:** Uses OpenAI (LLM) to rewrite "risky" text (e.g., "Win a holiday") into neutral, compliant copy. 
      * **Smart Background Removal:** Integrated `rembg` library for instant, high-quality product cutouts.
      * **Person Detection:** Uses Vision AI to detect people in images and trigger required compliance warnings. 
  * **⚡ Enterprise-Grade Output**
      * **Optimized Export:** Generates high-quality PNGs compressed to **\<500KB**. 
      * **Universal Format:** Toggles seamlessly between "Social Story (9:16)" and "Standard Banner" formats. 

## 🛠️ Tech Stack

### **Frontend (Visual Builder)**

  * **Framework:** React.js (Vite)
  * **Styling:** Tailwind CSS
  * **Core Libs:** `react-draggable`, `re-resizable`, `html2canvas`
  * **API Client:** Axios

### **Backend (Compliance Engine)**

  * **Language:** Golang (Go 1.21+)
  * **Router:** Gorilla Mux
  * **Docs:** Swagger (Swaggo)
  * **Logging:** `log/slog` (Structured JSON logging)

### **AI Service (Intelligence Layer)**

  * **Language:** Python 3.9+
  * **Framework:** FastAPI
  * **AI/ML:** OpenAI API, Rembg, OpenCV, Tesseract OCR
  * **Server:** Uvicorn

## 📂 Project Structure

```text
BrandGuard-AI/
├── frontend/           # React.js Visual Builder
│   ├── src/components/ # Canvas, Controls, Feedback panels
│   └── src/api/        # API Client logic
├── backend/            # Golang Compliance Engine
│   ├── cmd/server/     # Entry point
│   ├── internal/       # Rules, handlers, and logic
│   └── uploads/        # Local storage for assets
└── ai-service/         # Python GenAI & Vision Service
    ├── services/       # Vision & LLM logic
    └── main.py         # FastAPI entry point
```

## ⚙️ Installation & Setup

### **Prerequisites**

  * **Node.js** (v18+)
  * **Go** (v1.21+)
  * **Python** (v3.9+)
  * **Tesseract OCR** installed on your system.

### **1. AI Service Setup (Python)**

```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# Ensure .env file has OPENAI_API_KEY=sk-...
uvicorn main:app --reload --port 8000
```

### **2. Backend Setup (Golang)**

```bash
cd backend
go mod tidy
# Generate Swagger Docs
swag init -g cmd/server/main.go --parseDependency --parseInternal
go run cmd/server/main.go
# Server running at http://localhost:8080
```

### **3. Frontend Setup (React)**

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

## 🧪 Usage Guide (The "Winning" Demo Flow)

1.  **Upload:** Drag an image into the sidebar. Watch it appear on the canvas.
2.  **Compliance Check:** Drag the image into the **Top Red Zone**. Observe the "Hard Fail" error in the right panel.
3.  **AI Feature:** Click the **"✂️ Remove BG"** button and watch the background vanish.
4.  **Auto-Fix:** Upload text saying "Win a holiday". Click "Auto-Fix" to see AI rewrite it to neutral copy.
5.  **Export:** Click **"⬇ Export"** to download the final \<500KB PNG asset.

-----

*Built for the Retail Media Creative Hackathon.*