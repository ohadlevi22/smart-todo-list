'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { TodoInputProps } from '../types';
import { validateTodoText, APP_CONFIG, ARIA_LABELS, CSS_CLASSES } from '../utils';

/**
 * TodoInput component for creating new todos with validation and accessibility
 */
export const TodoInput: React.FC<TodoInputProps> = ({
  onSubmit,
  loading = false,
  placeholder = "What needs to be done?",
  maxLength = APP_CONFIG.maxTodoLength,
  autoFocus = false,
  className = '',
  onValidate = validateTodoText,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (loading || isComposing) return;

    const validation = onValidate(value);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      // Focus back to input for correction
      inputRef.current?.focus();
      return;
    }

    // Clear error and submit
    setError(null);
    await onSubmit(validation.sanitized || value);
    
    // Clear input after successful submission
    setValue('');
  }, [value, loading, isComposing, onValidate, onSubmit]);

  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  // Handle composition events for IME support
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // Handle key down for additional shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent submission during IME composition
    if (isComposing && event.key === 'Enter') {
      event.preventDefault();
      return;
    }
  }, [isComposing]);

  // Character count and validation indicators
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;
  
  // Dynamic classes based on state
  const inputClasses = [
    'w-full px-4 py-3 text-lg bg-white border rounded-lg shadow-sm transition-colors duration-200',
    error || isOverLimit
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    loading ? 'opacity-50 cursor-not-allowed' : '',
    CSS_CLASSES.FOCUS_RING,
    'placeholder:text-gray-400',
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'todo-input-container',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={loading}
            autoFocus={autoFocus}
            autoComplete="off"
            autoCapitalize="sentences"
            spellCheck="true"
            className={inputClasses}
            aria-label={ARIA_LABELS.NEW_TODO_INPUT}
            aria-describedby={
              error ? 'todo-input-error' :
              isNearLimit ? 'todo-input-count' : undefined
            }
            aria-invalid={error ? 'true' : 'false'}
          />
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
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
            </div>
          )}
        </div>

        {/* Character count indicator */}
        {isNearLimit && (
          <div
            id="todo-input-count"
            className={`mt-1 text-sm text-right ${
              isOverLimit ? 'text-red-600' : 'text-yellow-600'
            }`}
            aria-live="polite"
          >
            {characterCount}/{maxLength}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            id="todo-input-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Hidden submit button for form submission */}
        <button
          type="submit"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          disabled={loading || isOverLimit}
        >
          Add Todo
        </button>
      </form>

      {/* Instructions for screen readers */}
      <div className="sr-only" aria-live="polite">
        {loading && 'Adding todo...'}
        {error && `Error: ${error}`}
        {!error && !loading && value && 'Press Enter to add this todo'}
      </div>
    </div>
  );
};