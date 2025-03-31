import React from 'react';

export const Button = ({ children, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 text-white p-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}; 