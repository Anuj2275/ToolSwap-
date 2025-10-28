import React from 'react';
const Loader = ({ size = 'medium' }) => { // Optional size prop: 'small', 'medium', 'large'
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-4',
    large: 'h-16 w-16 border-4',
  };

  return (
    <div
      className="flex justify-center items-center py-10" 
      role="status"
      aria-label="Loading..." 
    >
      {/* Spinner using border color and animation */}
      <div
        className={`animate-spin rounded-full border-primary dark:border-primary-light border-t-transparent dark:border-t-transparent ${sizeClasses[size]}`}
        style={{ borderTopColor: 'transparent' }} 
      >
        <span className="sr-only">Loading...</span> {/* Screen reader text */}
      </div>
    </div>
  );
};

export default Loader;