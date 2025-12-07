import cv2
import numpy as np
import pytesseract
from PIL import Image
import io
import os

# IF YOU ARE ON WINDOWS, UNCOMMENT THE LINE BELOW AND CHECK THE PATH:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class VisionEngine:
    def __init__(self):
        # 1. SETUP TESSERACT PATH (Explicitly for Windows)
        # Check if the standard path exists, otherwise assume it's in PATH
        possible_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        if os.path.exists(possible_path):
            pytesseract.pytesseract.tesseract_cmd = possible_path

        # 2. LOAD HAARCASCADE
        # Uses the built-in OpenCV path
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        
        # Check if model loaded correctly
        if self.face_cascade.empty():
            print(f"WARNING: Could not load Haarcascade from {cascade_path}")

    def analyze(self, image_bytes):
        # Convert bytes to OpenCV format
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # ERROR CHECK: If image failed to load, return safe error
        if img is None:
            print("Error: OpenCV could not decode the image.")
            return {
                "has_person": False,
                "text": "",
                "safe_zone_violation": False,
                "error": "Image decoding failed"
            }

        height, width, _ = img.shape
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. PERSON DETECTION
        try:
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            has_person = len(faces) > 0
        except Exception as e:
            print(f"Face detection error: {e}")
            has_person = False

        # 2. OCR TEXT EXTRACTION
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            extracted_text = pytesseract.image_to_string(pil_img)
        except Exception as e:
            # Common error if Tesseract isn't installed/found
            print(f"OCR Error (Tesseract not found?): {e}")
            extracted_text = ""

        # 3. SAFE ZONE CHECK (Basic Pixel Check)
        safe_zone_violation = False
        # (Your existing logic here remains the same)
        # ...

        return {
            "has_person": has_person,
            "text": extracted_text.strip(),
            "safe_zone_violation": safe_zone_violation
        }