'use client';

import React, { forwardRef } from 'react';
import type { ButtonProps } from '../../types';
import { CSS_CLASSES } from '../../utils';

/**
 * Get button variant styles
 */
const getVariantStyles = (variant: ButtonProps['variant'] = 'primary'): string => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'hover:bg-gray-100 text-gray-700 border-transparent',
  };
  
  return variants[variant];
};

/**
 * Get button size styles
 */
const getSizeStyles = (size: ButtonProps['size'] = 'md'): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return sizes[size];
};

/**
 * Reusable Button component with variants, sizes, and accessibility features
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const buttonClasses = [
      baseStyles,
      variantStyles,
      sizeStyles,
      widthStyles,
      CSS_CLASSES.FOCUS_RING,
      className,
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || loading;
    const buttonAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-label={buttonAriaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';