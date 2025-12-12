import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import html2canvas from 'html2canvas';
import SafeZoneOverlay from './SafeZoneOverlay';
import { analyzeImage, removeBackground } from '../../api/client';

const CreativeCanvas = ({ format, uploadedFile, onAnalysisComplete }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const canvasRef = useRef(null);
  // FIX 1: Create a Ref for Draggable to stop the crash
  const nodeRef = useRef(null);

  const width = 324;
  const height = 576;

  useEffect(() => {
    if (uploadedFile && uploadedFile instanceof File) processFile(uploadedFile);
  }, [uploadedFile]);

  const processFile = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setLoading(true);
    try {
      const data = await analyzeImage(file);
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleRemoveBg = async () => {
    setLoading(true);
    try {
      const blob = await removeBackground(uploadedFile);
      setImagePreview(URL.createObjectURL(blob));
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    // FIX 2: Force white background to stop "oklch" error
    const canvas = await html2canvas(canvasRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff', // <--- THIS FIXES THE EXPORT ERROR
    });

    const link = document.createElement('a');
    link.download = 'creative.png';
    link.href = canvas.toDataURL('image/png', 0.8);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button onClick={handleRemoveBg} className="bg-purple-600 text-white px-3 py-1 rounded">
            {loading ? "..." : "✂️ Remove BG"}
        </button>
        <button onClick={handleDownload} className="bg-blue-600 text-white px-3 py-1 rounded">
            ⬇ Export
        </button>
      </div>

      <div ref={canvasRef} className="relative bg-white border border-gray-300 overflow-hidden" style={{ width: `${width}px`, height: `${height}px` }}>
        <SafeZoneOverlay width={width} height={height} scale={0.3} />
        
        {imagePreview && (
          // FIX 1 APPLIED: nodeRef passed to Draggable AND the div
          <Draggable bounds="parent" nodeRef={nodeRef}>
            <div ref={nodeRef} className="absolute top-10 left-10 inline-block cursor-move">
                <Resizable defaultSize={{ width: 200, height: 200 }} lockAspectRatio={true}>
                  <img src={imagePreview} className="w-full h-full object-contain pointer-events-none" />
                </Resizable>
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
};

export default CreativeCanvas;