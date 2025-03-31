import React from 'react';

interface LoadingIndicatorProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  text = 'Loading...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin mb-4`} 
        role="status" 
        aria-label="loading"
      />
      {text && <p className="text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingIndicator;