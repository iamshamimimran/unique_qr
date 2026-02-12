import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  fullWidth = true,
  ...props 
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl bg-gray-900/50 border 
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20'} 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-4 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
