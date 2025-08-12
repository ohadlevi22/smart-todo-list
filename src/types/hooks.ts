import { type Todo, type FilterType, type TodoCounts } from './todo';
import { type ErrorState, type KeyboardHandler } from './app';

/**
 * Todo management hook return type
 */
export interface UseTodosReturn {
  /** Array of all todos */
  todos: Todo[];
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Current error state */
  error: ErrorState | null;
  
  /** Add new todo */
  addTodo: (text: string) => Promise<void>;
  
  /** Toggle todo completion status */
  toggleTodo: (id: string) => Promise<void>;
  
  /** Update todo text */
  updateTodo: (id: string, text: string) => Promise<void>;
  
  /** Delete single todo */
  deleteTodo: (id: string) => Promise<void>;
  
  /** Delete all completed todos */
  deleteCompleted: () => Promise<void>;
  
  /** Clear all todos */
  clearAll: () => Promise<void>;
  
  /** Get filtered todos based on current filter */
  getFilteredTodos: (filter: FilterType) => Todo[];
  
  /** Get todo counts by status */
  getCounts: () => TodoCounts;
}

/**
 * localStorage hook return type
 */
export interface UseLocalStorageReturn<T> {
  /** Current stored value */
  value: T;
  
  /** Update stored value */
  setValue: (newValue: T | ((prevValue: T) => T)) => void;
  
  /** Remove value from storage */
  removeValue: () => void;
  
  /** Storage operation error */
  error: string | null;
  
  /** Whether storage is available */
  isAvailable: boolean;
}

/**
 * Keyboard navigation hook return type
 */
export interface UseKeyboardReturn {
  /** Register keyboard handler */
  registerHandler: (handler: KeyboardHandler) => () => void;
  
  /** Focus management utilities */
  focusUtils: {
    /** Focus next focusable element */
    focusNext: () => void;
    
    /** Focus previous focusable element */
    focusPrevious: () => void;
    
    /** Focus first focusable element */
    focusFirst: () => void;
    
    /** Focus last focusable element */
    focusLast: () => void;
  };
}

/**
 * Filter management hook return type
 */
export interface UseFilterReturn {
  /** Current active filter */
  currentFilter: FilterType;
  
  /** Set active filter */
  setFilter: (filter: FilterType) => void;
  
  /** Get filtered todos */
  getFilteredTodos: (todos: Todo[]) => Todo[];
  
  /** Filter URLs for bookmarking */
  filterUrls: {
    all: string;
    active: string;
    completed: string;
  };
}