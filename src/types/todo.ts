/**
 * Core todo item entity representing a user task
 */
export interface Todo {
  /** Unique identifier using UUID v4 format */
  id: string;
  
  /** User-provided task description (1-500 characters) */
  text: string;
  
  /** Completion status of the todo item */
  completed: boolean;
  
  /** ISO timestamp of todo creation */
  createdAt: string;
  
  /** ISO timestamp of last modification */
  updatedAt: string;
}

/**
 * Available filter types for todo list display
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo count statistics by status
 */
export interface TodoCounts {
  /** Total number of todos */
  all: number;
  
  /** Number of incomplete todos */
  active: number;
  
  /** Number of completed todos */
  completed: number;
}

/**
 * Application view state
 */
export interface ViewState {
  /** Currently active filter */
  currentFilter: FilterType;
  
  /** Todo statistics */
  counts: TodoCounts;
  
  /** ID of currently editing todo (null if none) */
  editingId: string | null;
}