
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'full' | 'icon-only';
  className?: string;
}

export function Logo({ size = 'md', type = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'h-8', text: 'text-lg' },
    md: { container: 'h-10', text: 'text-xl' },
    lg: { container: 'h-12', text: 'text-2xl' },
    xl: { container: 'h-16', text: 'text-3xl' },
  };

  const containerClass = sizeClasses[size].container;
  const textClass = sizeClasses[size].text;

  return (
    <Link 
      to="/" 
      className={`flex items-center space-x-2 ${className}`}
    >
      <div className={`relative ${containerClass} aspect-square bg-gradient-to-r from-purple-600 to-green-500 rounded-md flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-cream-100 opacity-20" />
        <span className="relative text-white font-bold text-xl">S</span>
      </div>
      {type === 'full' && (
        <span className={`font-bold ${textClass} bg-gradient-to-r from-purple-600 via-purple-500 to-green-500   bg-clip-text`}>
          Seedial
        </span>
      )}
    </Link>
  );
}
