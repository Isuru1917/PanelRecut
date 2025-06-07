import React from 'react';

interface AquaDynamicsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AquaDynamicsLogo: React.FC<AquaDynamicsLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-10 h-7',
    lg: 'w-16 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img
        src="/aqua-dynamics-logo.svg"
        alt="Aqua Dynamics Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AquaDynamicsLogo;
