import type { Todo, FilterType, TodoCounts } from '../types';
import { validateAndSanitize } from './validation';

/**
 * Generate a UUID v4
 */
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Create new todo with generated ID and timestamps
 */
export const createTodo = (text: string): Todo => {
  const validation = validateAndSanitize(text);
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid todo text');
  }
  
  const now = new Date().toISOString();
  
  return {
    id: generateUUID(),
    text: validation.sanitized || text,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Update todo with new timestamp
 */
export const updateTodo = (todo: Todo, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo => {
  // Validate text if it's being updated
  if (updates.text !== undefined) {
    const validation = validateAndSanitize(updates.text);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid todo text');
    }
    updates.text = validation.sanitized;
  }
  
  return {
    ...todo,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Filter todos by completion status
 */
export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
};

/**
 * Sort todos by creation date (newest first)
 */
export const sortTodos = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Newest first
  });
};

/**
 * Sort todos with completed items at the bottom
 */
export const sortTodosWithCompletedLast = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by creation date (newest first for same status)
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
};

/**
 * Calculate todo statistics
 */
export const calculateTodoCounts = (todos: Todo[]): TodoCounts => {
  const all = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = all - completed;
  
  return { all, active, completed };
};

/**
 * Find todo by ID
 */
export const findTodoById = (todos: Todo[], id: string): Todo | undefined => {
  return todos.find(todo => todo.id === id);
};

/**
 * Toggle todo completion status
 */
export const toggleTodoCompletion = (todo: Todo): Todo => {
  return updateTodo(todo, { completed: !todo.completed });
};

/**
 * Get completed todos
 */
export const getCompletedTodos = (todos: Todo[]): Todo[] => {
  return todos.filter(todo => todo.completed);
};

/**
 * Get active (incomplete) todos
 */
export const getActiveTodos = (todos: Todo[]): Todo[] => {
  return todos.filter(todo => !todo.completed);
};

/**
 * Remove todo from array by ID
 */
export const removeTodoById = (todos: Todo[], id: string): Todo[] => {
  return todos.filter(todo => todo.id !== id);
};

/**
 * Remove all completed todos
 */
export const removeCompletedTodos = (todos: Todo[]): Todo[] => {
  return todos.filter(todo => !todo.completed);
};

/**
 * Update todo in array by ID
 */
export const updateTodoInArray = (todos: Todo[], id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] => {
  return todos.map(todo => 
    todo.id === id ? updateTodo(todo, updates) : todo
  );
};