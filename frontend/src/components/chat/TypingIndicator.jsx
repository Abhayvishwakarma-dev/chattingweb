import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-1">
      <div className="bg-white text-gray-800 rounded-r-lg rounded-tl-lg px-4 py-3 shadow-sm">
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full typing-dot" 
            style={{ animationDelay: '0s' }}
          ></div>
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full typing-dot" 
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full typing-dot" 
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;