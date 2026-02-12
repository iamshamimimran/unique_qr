import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glass = true,
  ...props 
}) => {
  const baseStyles = "rounded-2xl p-6 overflow-hidden relative";
  const glassStyles = glass ? "glass-panel" : "bg-gray-800 border border-gray-700";
  
  const Comp = hover ? motion.div : 'div';
  const animationProps = hover ? {
    whileHover: { y: -5, transition: { duration: 0.2 } },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  } : {};

  return (
    <Comp
      className={`${baseStyles} ${glassStyles} ${className}`}
      {...animationProps}
      {...props}
    >
      {/* Decorative gradient blob for glass cards */}
      {glass && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Comp>
  );
};

export default Card;
