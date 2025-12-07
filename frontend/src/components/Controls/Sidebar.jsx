import React from 'react';

const Sidebar = ({ onFormatChange, onUploadSuccess }) => {
  
  const handleFileChange = (e) => {
    // Safety Check: Did the user actually select a file?
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Safety Check: Is it actually an image?
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG/PNG)");
      return;
    }

    if (onUploadSuccess) {
      console.log("Sidebar: Passing file to App ->", file.name);
      onUploadSuccess(file); 
    }
  };

  return (
    <div className="space-y-8 font-sans text-gray-700">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Creative Setup</h2>
        <p className="text-sm text-gray-500">Configure your campaign settings.</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500">
          Format & Size
        </label>
        <select 
          onChange={(e) => onFormatChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Story_9x16">Social Story (9:16)</option>
          <option value="Banner_Standard">Standard Banner</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500">
          Upload Asset
        </label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
};

export default Sidebar;