import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 transition-all duration-300 ${className}`}>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default Card;