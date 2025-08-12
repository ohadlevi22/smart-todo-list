'use client';

import { useState, useCallback } from 'react';
import type { UseLocalStorageReturn } from '../types';
import { getStorageItem, setStorageItem, isStorageAvailable } from '../utils';

/**
 * Custom hook for localStorage operations with automatic JSON serialization and error handling
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  // Initialize state with a function to avoid re-running on every render
  const [value, setValue] = useState<T>(() => {
    if (!isStorageAvailable()) {
      return defaultValue;
    }
    
    const result = getStorageItem<T>(key);
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    
    return defaultValue;
  });
  
  const [error, setError] = useState<string | null>(null);
  const isAvailable = isStorageAvailable();

  // Update localStorage and state
  const setStoredValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    setValue((currentValue) => {
      const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
      
      if (!isAvailable) {
        setError('Local storage is not available');
        return valueToStore;
      }

      const result = setStorageItem(key, valueToStore);
      
      if (result.success) {
        setError(null);
      } else {
        setError(result.error || 'Failed to save to storage');
      }
      
      return valueToStore;
    });
  }, [key, isAvailable]);

  // Remove value from storage
  const removeValue = useCallback(() => {
    setValue(defaultValue);
    setError(null);
    
    if (isAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove from storage';
        setError(errorMessage);
      }
    }
  }, [key, defaultValue, isAvailable]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    error,
    isAvailable,
  };
}