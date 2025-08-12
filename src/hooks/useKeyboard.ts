'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { UseKeyboardReturn, KeyboardHandler } from '../types';
import { focusNext, focusPrevious, focusFirst, focusLast } from '../utils';

/**
 * Parse keyboard shortcut string into modifier keys and main key
 */
const parseKeyboardShortcut = (shortcut: string) => {
  const parts = shortcut.split('+');
  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1).map(m => m.toLowerCase());
  
  return {
    key,
    ctrl: modifiers.includes('ctrl'),
    alt: modifiers.includes('alt'),
    shift: modifiers.includes('shift'),
    meta: modifiers.includes('meta') || modifiers.includes('cmd'),
  };
};

/**
 * Check if keyboard event matches the handler configuration
 */
const matchesHandler = (event: KeyboardEvent, handler: KeyboardHandler): boolean => {
  const parsed = parseKeyboardShortcut(handler.key);
  
  // Check main key
  const keyMatches = event.key === parsed.key || 
                    event.code === parsed.key ||
                    event.key.toLowerCase() === parsed.key?.toLowerCase();
  
  if (!keyMatches) return false;
  
  // Check modifier keys
  return (
    event.ctrlKey === parsed.ctrl &&
    event.altKey === parsed.alt &&
    event.shiftKey === parsed.shift &&
    event.metaKey === parsed.meta
  );
};

/**
 * Custom hook for keyboard navigation and shortcuts
 */
export function useKeyboard(): UseKeyboardReturn {
  const handlersRef = useRef<Map<string, KeyboardHandler>>(new Map());

  // Register keyboard handler
  const registerHandler = useCallback((handler: KeyboardHandler): (() => void) => {
    const id = Math.random().toString(36).substring(7);
    const target = handler.target || document;
    
    const eventHandler = (event: KeyboardEvent) => {
      if (matchesHandler(event, handler)) {
        if (handler.preventDefault) {
          event.preventDefault();
        }
        handler.handler(event);
      }
    };
    
    // Store handler reference for cleanup
    handlersRef.current.set(id, { ...handler, handler: eventHandler });
    
    // Add event listener
    target.addEventListener('keydown', eventHandler as EventListener);
    
    // Return cleanup function
    return () => {
      target.removeEventListener('keydown', eventHandler as EventListener);
      handlersRef.current.delete(id);
    };
  }, []);

  // Focus management utilities
  const focusUtils = {
    focusNext: useCallback(() => {
      const currentElement = document.activeElement as HTMLElement;
      focusNext(currentElement);
    }, []),
    
    focusPrevious: useCallback(() => {
      const currentElement = document.activeElement as HTMLElement;
      focusPrevious(currentElement);
    }, []),
    
    focusFirst: useCallback(() => {
      focusFirst();
    }, []),
    
    focusLast: useCallback(() => {
      focusLast();
    }, []),
  };

  // Cleanup all handlers on unmount
  useEffect(() => {
    return () => {
      handlersRef.current.clear();
    };
  }, []);

  return {
    registerHandler,
    focusUtils,
  };
}