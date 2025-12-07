import React, { useState } from 'react';
import { fixCopy } from '../../api/client';

const AutoFixButton = ({ originalText }) => {
  const [fixedText, setFixedText] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAutoFix = async () => {
    setLoading(true);
    try {
      // We assume a generic 'competitions' violation for this demo
      // In a real app, you'd auto-detect the specific violation type first
      const data = await fixCopy(originalText, "competitions");
      setFixedText(data.fixed);
    } catch (err) {
      alert("Failed to fix copy");
    } finally {
      setLoading(false);
    }
  };

  if (fixedText) {
    return (
      <div className="mt-2 animate-fade-in">
        <div className="text-xs font-bold text-green-700 mb-1">✨ AI Suggestion:</div>
        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-gray-800">
          {fixedText}
        </div>
        <button 
          className="text-[10px] text-blue-600 underline mt-1 cursor-pointer"
          onClick={() => setFixedText(null)}
        >
          Revert
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAutoFix}
      disabled={loading}
      className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded transition-colors"
    >
      {loading ? (
        <span>Rewriting...</span>
      ) : (
        <>
          <span>🪄 Auto-Fix Copy</span>
        </>
      )}
    </button>
  );
};

export default AutoFixButton;