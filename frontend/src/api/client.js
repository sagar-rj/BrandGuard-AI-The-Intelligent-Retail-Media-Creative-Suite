import axios from 'axios';

// Ensure this matches your Uvicorn URL
const AI_SERVICE_URL = 'http://127.0.0.1:8000';
const BACKEND_URL = 'http://localhost:8080';


// Add this function to your frontend API client
export const validateLayout = async (creativeData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/validate`, creativeData);
    return response.data;
  } catch (error) {
    console.error("Backend Validation Error:", error);
    throw error;
  }
};

/**
 * Sends image to Python for background removal.
 * Returns a Blob URL of the new transparent image.
 */
export const removeBackground = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/process/remove-bg`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob', // Important: We expect a binary file back
    });
    return response.data; // This is the Blob
  } catch (error) {
    console.error("BG Removal Error:", error);
    throw error;
  }
};

/**
 * Uploads an asset to the Golang Backend for storage.
 */
export const uploadAsset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // Returns { url: "...", filename: "..." }
  } catch (error) {
    console.error("Asset Upload Error:", error);
    throw error;
  }
};

/**
 * Uploads an image for Vision AI analysis (Safe Zones, People, OCR).
 */
export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw error;
  }
};

/**
 * Sends text to the LLM for compliance rewriting.
 */
export const fixCopy = async (text, violationType) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/fix/copy`, {
      text: text,
      violation_type: violationType
    });
    return response.data;
  } catch (error) {
    console.error("GenAI Error:", error);
    throw error;
  }
};

