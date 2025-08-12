import { type Todo, type FilterType } from './todo';

/**
 * Input validation result
 */
export interface ValidationResult {
  /** Whether the input is valid */
  isValid: boolean;
  
  /** Error message if validation failed */
  error?: string;
  
  /** Sanitized value if validation passed */
  sanitized?: string;
}

/**
 * Application error types
 */
export type AppError = 
  | 'STORAGE_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error state interface
 */
export interface ErrorState {
  /** Type of error that occurred */
  type: AppError;
  
  /** Human-readable error message */
  message: string;
  
  /** Timestamp when error occurred */
  timestamp: string;
  
  /** Whether error can be retried */
  retryable: boolean;
}

/**
 * Application state interface
 */
export interface AppState {
  /** Array of todos */
  todos: Todo[];
  
  /** Current active filter */
  filter: FilterType;
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Current error state */
  error: ErrorState | null;
  
  /** ID of currently editing todo (null if none) */
  editingId: string | null;
}

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  /** Whether operation was successful */
  success: boolean;
  
  /** Retrieved or stored data */
  data?: T;
  
  /** Error message if operation failed */
  error?: string;
}

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Keyboard event handler configuration
 */
export interface KeyboardHandler {
  /** Key combination (e.g., 'Enter', 'Ctrl+s', 'Escape') */
  key: string;
  
  /** Handler function */
  handler: (event: KeyboardEvent) => void;
  
  /** Whether to prevent default behavior */
  preventDefault?: boolean;
  
  /** Element to attach listener to (defaults to document) */
  target?: HTMLElement | null;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  /** Maximum todo text length */
  maxTodoLength: number;
  
  /** localStorage key for todos */
  storageKey: string;
  
  /** Default filter */
  defaultFilter: FilterType;
  
  /** Auto-save delay in milliseconds */
  autoSaveDelay: number;
  
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts: boolean;
  
  /** Animation duration in milliseconds */
  animationDuration: number;
  
  /** Development mode flag */
  isDevelopment: boolean;
}

/**
 * Todo event types for internal event system
 */
export type TodoEventType = 
  | 'todo:created'
  | 'todo:updated'
  | 'todo:deleted'
  | 'todo:toggled'
  | 'filter:changed'
  | 'storage:error';

/**
 * Todo event data
 */
export interface TodoEvent<T = any> {
  /** Event type */
  type: TodoEventType;
  
  /** Event payload */
  payload: T;
  
  /** Timestamp */
  timestamp: string;
}