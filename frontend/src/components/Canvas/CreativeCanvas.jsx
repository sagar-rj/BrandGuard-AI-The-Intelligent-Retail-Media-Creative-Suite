import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import html2canvas from 'html2canvas';
import SafeZoneOverlay from './SafeZoneOverlay';
import { analyzeImage, removeBackground } from '../../api/client';

const CreativeCanvas = ({ format, uploadedFile, onAnalysisComplete }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const canvasRef = useRef(null);
  
  // FIX 1: Create a ref for the draggable node
  const nodeRef = useRef(null);

  const width = 324;
  const height = 576;

  useEffect(() => {
    if (uploadedFile && uploadedFile instanceof File) {
      processFile(uploadedFile);
    }
  }, [uploadedFile]);

  const processFile = async (file) => {
    setErrorMsg(null);
    try {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    } catch (e) {
      setErrorMsg("Failed to load image.");
      return; 
    }
    
    setLoading(true);
    try {
      const data = await analyzeImage(file);
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) {
      console.error("API Error", err);
      // Don't show error on screen for now to avoid confusion
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBg = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    try {
      const blob = await removeBackground(uploadedFile);
      const newUrl = URL.createObjectURL(blob);
      setImagePreview(newUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    // FIX 2: Force white background to solve "oklch" color error
    const canvas = await html2canvas(canvasRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff', // <--- THIS FIXES THE EXPORT CRASH
    });

    const link = document.createElement('a');
    link.download = 'tesco-creative.png';
    link.href = canvas.toDataURL('image/png', 0.8);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-[324px] items-center">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {format.replace('_', ' ')}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRemoveBg}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded font-bold shadow disabled:bg-gray-400"
          >
            {loading ? "..." : "✂️ Remove BG"}
          </button>
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-bold shadow"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      <div 
        ref={canvasRef} 
        className="relative bg-white shadow-2xl border border-gray-300 overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <SafeZoneOverlay width={width} height={height} scale={0.3} />

        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 flex items-center justify-center">
            <span className="animate-pulse text-blue-600 font-bold">Processing...</span>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm border border-red-300">
              {errorMsg}
            </div>
          </div>
        )}

        {imagePreview ? (
          // FIX 1 APPLIED HERE: Pass nodeRef to Draggable
          <Draggable bounds="parent" nodeRef={nodeRef}>
            <div ref={nodeRef} className="absolute top-10 left-10 inline-block cursor-move">
                <Resizable
                  defaultSize={{ width: 200, height: 200 }}
                  lockAspectRatio={true}
                  style={{ border: '1px dashed rgba(59, 130, 246, 0.5)' }}
                >
                  <img 
                    src={imagePreview} 
                    className="w-full h-full object-contain pointer-events-none" 
                    alt="Ad Creative" 
                    crossOrigin="anonymous" 
                  />
                </Resizable>
            </div>
          </Draggable>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 m-4 rounded">
            <p>Select File from Sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeCanvas;