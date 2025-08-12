import type { ValidationResult } from '../types';
import { APP_CONFIG, ERROR_MESSAGES } from './constants';

/**
 * Validate todo text input
 */
export const validateTodoText = (text: string): ValidationResult => {
  // Trim whitespace
  const trimmed = text.trim();
  
  // Check for empty text
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.EMPTY_TODO,
    };
  }
  
  // Check length limit
  if (trimmed.length > APP_CONFIG.maxTodoLength) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.TODO_TOO_LONG,
    };
  }
  
  return {
    isValid: true,
    sanitized: trimmed,
  };
};

/**
 * Sanitize user input by removing potentially harmful content
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags specifically
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
};

/**
 * Check if text exceeds character limit
 */
export const isTextTooLong = (text: string, limit: number = APP_CONFIG.maxTodoLength): boolean => {
  return text.trim().length > limit;
};

/**
 * Check if text is empty or only whitespace
 */
export const isEmpty = (text: string): boolean => {
  return text.trim().length === 0;
};

/**
 * Validate and sanitize todo text in one step
 */
export const validateAndSanitize = (text: string): ValidationResult => {
  const sanitized = sanitizeInput(text);
  return validateTodoText(sanitized);
};

/**
 * Check if a string is a valid UUID v4
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Validate todo ID
 */
export const validateTodoId = (id: string): ValidationResult => {
  if (!id || typeof id !== 'string') {
    return {
      isValid: false,
      error: 'Todo ID must be a valid string',
    };
  }
  
  if (!isValidUUID(id)) {
    return {
      isValid: false,
      error: 'Todo ID must be a valid UUID',
    };
  }
  
  return {
    isValid: true,
    sanitized: id,
  };
};