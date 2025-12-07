from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# 1. Safe Import for rembg to prevent crashes if it fails
try:
    from rembg import remove
except ImportError:
    print("WARNING: 'rembg' not installed. Background removal will fail.")
    remove = None

# 2. Load Environment Variables
load_dotenv()

from services.vision import VisionEngine
from services.llm import ComplianceLLM

app = FastAPI(title="Retail Media AI Service")

# 3. Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for prototype
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_engine = VisionEngine()
llm_engine = ComplianceLLM()

class TextFixRequest(BaseModel):
    text: str
    violation_type: str

@app.get("/")
def health_check():
    return {"status": "AI Service Ready"}

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    # 4. REMOVED STRICT TYPE CHECKING to fix "400 Bad Request"
    print(f"DEBUG: Analyzing file: {file.filename} ({file.content_type})")
    
    try:
        image_data = await file.read()
        results = vision_engine.analyze(image_data)
        return {
            "has_person": results["has_person"],
            "extracted_text": results["text"],
            "safe_zone_violation": results["safe_zone_violation"]
        }
    except Exception as e:
        print(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process/remove-bg")
async def remove_background_endpoint(file: UploadFile = File(...)):
    if remove is None:
        raise HTTPException(status_code=500, detail="Rembg library not installed on server.")
        
    try:
        input_image = await file.read()
        output_image = remove(input_image)
        return Response(content=output_image, media_type="image/png")
    except Exception as e:
        print(f"Rembg Error: {e}")
        raise HTTPException(status_code=500, detail="Background removal failed")

@app.post("/fix/copy")
async def fix_copy_compliance(request: TextFixRequest):
    try:
        fixed_text = llm_engine.rewrite_copy(request.text, request.violation_type)
        return {"original": request.text, "fixed": fixed_text}
    except Exception as e:
        print(f"LLM Error: {e}")
        raise HTTPException(status_code=500, detail="LLM generation failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)