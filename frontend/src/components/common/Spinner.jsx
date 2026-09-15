import React from 'react';

const Spinner = ({ size = 'md', color = 'green', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    green: 'border-whatsapp-green',
    white: 'border-white',
    blue: 'border-blue-500',
    gray: 'border-gray-500',
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin border-t-transparent`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Loading overlay with text
export const LoadingOverlay = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-500 text-sm">{text}</p>
    </div>
  );
};

// Loading dots animation
export const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default Spinner;