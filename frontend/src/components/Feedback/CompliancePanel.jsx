import React from 'react';
import AutoFixButton from './AutoFixButton';

const CompliancePanel = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
        <div className="text-4xl mb-4">🛡️</div>
        <p>Upload an image to run <br/> AI Compliance Checks</p>
      </div>
    );
  }

  // Determine overall status
  const isFail = result.safe_zone_violation;
  const isWarning = result.has_person; 

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Compliance Report</h2>
        <div className={`p-3 rounded-lg text-sm font-bold text-center ${isFail ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          STATUS: {isFail ? 'NON-COMPLIANT' : 'PASS'}
        </div>
      </div>

      {/* 1. Safe Zones Check */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Format & Geometry</h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
          <span className="text-sm">Safe Zones (200px/250px)</span>
          {result.safe_zone_violation ? (
            <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded">FAIL</span>
          ) : (
            <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded">OK</span>
          )}
        </div>
        {result.safe_zone_violation && (
          <p className="text-xs text-red-600 mt-1">
            ❌ Elements detected in prohibited top/bottom zones.
          </p>
        )}
      </div>

      {/* 2. Content & Accessibility Check */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Content Rules</h3>
        
        {/* Person Detection Rule [cite: 7] */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border mb-2">
          <span className="text-sm">Person Detection</span>
          {result.has_person ? (
             <span className="text-xs font-bold text-white bg-yellow-500 px-2 py-1 rounded">WARN</span>
          ) : (
            <span className="text-xs font-bold text-gray-400 px-2 py-1 rounded">N/A</span>
          )}
        </div>
        {result.has_person && (
          <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mb-2">
            ⚠️ <strong>Manual Action Required:</strong> Confirm people are integral to the campaign.
          </div>
        )}

        {/* OCR Text Analysis */}
        <div className="p-3 bg-gray-50 rounded border">
          <span className="text-sm block mb-2 font-semibold">Extracted Copy:</span>
          <p className="text-xs italic text-gray-600 bg-white p-2 border rounded">
            "{result.text || "No readable text found."}"
          </p>
          
          {/* GenAI Auto-Fix Integration */}
          {result.text && (
            <div className="mt-3">
              <AutoFixButton originalText={result.text} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompliancePanel;