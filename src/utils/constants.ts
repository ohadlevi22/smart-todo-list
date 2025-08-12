import type { AppConfig } from '../types';

/**
 * Application configuration constants
 */
export const APP_CONFIG: AppConfig = {
  /** Maximum todo text length */
  maxTodoLength: 500,
  
  /** localStorage key for todos */
  storageKey: 'todo-app-todos',
  
  /** Default filter */
  defaultFilter: 'all',
  
  /** Auto-save delay in milliseconds */
  autoSaveDelay: 1000,
  
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts: true,
  
  /** Animation duration in milliseconds */
  animationDuration: 200,
  
  /** Development mode flag */
  isDevelopment: process.env.NODE_ENV === 'development',
};

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  /** Add new todo */
  NEW_TODO: 'Enter',
  
  /** Save edit */
  SAVE_EDIT: 'Enter',
  
  /** Cancel edit */
  CANCEL_EDIT: 'Escape',
  
  /** Delete todo */
  DELETE_TODO: 'Delete',
  
  /** Toggle completion */
  TOGGLE_TODO: 'Space',
  
  /** Focus next item */
  NEXT_ITEM: 'ArrowDown',
  
  /** Focus previous item */
  PREV_ITEM: 'ArrowUp',
  
  /** Show all todos */
  SHOW_ALL: 'KeyA',
  
  /** Show active todos */
  SHOW_ACTIVE: 'KeyT',
  
  /** Show completed todos */
  SHOW_COMPLETED: 'KeyC',
} as const;

/**
 * CSS class names for consistent styling
 */
export const CSS_CLASSES = {
  /** Focus ring for accessibility */
  FOCUS_RING: 'focus-ring',
  
  /** Smooth transition */
  TRANSITION: 'transition-smooth',
  
  /** Screen reader only */
  SR_ONLY: 'sr-only',
  
  /** Todo container */
  TODO_CONTAINER: 'todo-container',
  
  /** Enter animation */
  ANIMATE_ENTER: 'animate-todo-enter',
  
  /** Exit animation */
  ANIMATE_EXIT: 'animate-todo-exit',
} as const;

/**
 * ARIA labels for accessibility
 */
export const ARIA_LABELS = {
  /** Main todo list */
  TODO_LIST: 'Todo list',
  
  /** Todo item */
  TODO_ITEM: 'Todo item',
  
  /** Toggle completion */
  TOGGLE_TODO: 'Toggle todo completion',
  
  /** Edit todo */
  EDIT_TODO: 'Edit todo',
  
  /** Delete todo */
  DELETE_TODO: 'Delete todo',
  
  /** New todo input */
  NEW_TODO_INPUT: 'Enter new todo',
  
  /** Filter controls */
  FILTER_CONTROLS: 'Filter todos',
  
  /** Todo statistics */
  TODO_STATS: 'Todo statistics',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  /** Storage error */
  STORAGE_ERROR: 'Failed to save data. Please try again.',
  
  /** Validation error */
  VALIDATION_ERROR: 'Invalid input. Please check your entry.',
  
  /** Not found error */
  NOT_FOUND_ERROR: 'Todo item not found.',
  
  /** Unknown error */
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  /** Empty todo text */
  EMPTY_TODO: 'Todo text cannot be empty.',
  
  /** Todo too long */
  TODO_TOO_LONG: 'Todo text must be 500 characters or less.',
  
  /** Storage not available */
  STORAGE_NOT_AVAILABLE: 'Local storage is not available in your browser.',
} as const;