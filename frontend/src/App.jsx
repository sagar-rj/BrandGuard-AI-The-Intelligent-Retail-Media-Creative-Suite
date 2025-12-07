import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Controls/Sidebar';
import CreativeCanvas from './components/Canvas/CreativeCanvas';
import CompliancePanel from './components/Feedback/CompliancePanel';

const App = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentFormat, setCurrentFormat] = useState('Story_9x16');
  const [selectedFile, setSelectedFile] = useState(null); 

  const handleUploadSuccess = (file) => {
    // Double check we have a file before updating state
    if (file && file instanceof File) {
      console.log("App: Valid file received, updating state...");
      setSelectedFile(file);
    } else {
      console.error("App: Received invalid file object:", file);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r border-gray-200 p-5 overflow-y-auto">
          <Sidebar 
            onFormatChange={setCurrentFormat} 
            onUploadSuccess={handleUploadSuccess}
          />
        </aside>

        <main className="flex-1 flex items-center justify-center bg-gray-100 p-8 relative">
          <CreativeCanvas 
            format={currentFormat} 
            uploadedFile={selectedFile}  
            onAnalysisComplete={setAnalysisResult} 
          />
        </main>

        <aside className="w-96 bg-white border-l border-gray-200 p-5 overflow-y-auto">
          <CompliancePanel result={analysisResult} />
        </aside>
      </div>
    </div>
  );
};

export default App;