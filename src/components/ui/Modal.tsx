'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from '../../types';
import { FocusManager } from '../../utils';
import { Button } from './Button';

/**
 * Get modal size styles
 */
const getSizeStyles = (size: ModalProps['size'] = 'md'): string => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  return sizes[size];
};

/**
 * Modal component with focus trapping and accessibility features
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const focusManagerRef = useRef<FocusManager>(new FocusManager());

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusManager = focusManagerRef.current;
    const cleanup = focusManager.trapFocus(modalRef.current);

    return () => {
      cleanup();
      focusManager.restoreFocus();
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  };

  const sizeStyles = getSizeStyles(size);

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6 w-full ${sizeStyles} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3
                id="modal-title"
                className="text-lg font-semibold leading-6 text-gray-900"
              >
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
                className="!p-2 hover:bg-gray-100 rounded-md"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};