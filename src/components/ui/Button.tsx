import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-full transition-colors duration-200 text-white';
  
  const variants = {
    primary: 'px-4 py-2 bg-red-500 hover:bg-red-600',
    secondary: 'px-4 py-2 bg-gray-800/90 hover:bg-gray-700/90',
    icon: 'p-2 bg-gray-800/90 hover:bg-gray-700/90',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};