// Constants
export { 
  APP_CONFIG, 
  KEYBOARD_SHORTCUTS, 
  CSS_CLASSES, 
  ARIA_LABELS, 
  ERROR_MESSAGES 
} from './constants';

// Validation utilities
export {
  validateTodoText,
  sanitizeInput,
  isTextTooLong,
  isEmpty,
  validateAndSanitize,
  isValidUUID,
  validateTodoId
} from './validation';

// Storage utilities
export {
  isStorageAvailable,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  getStorageStats
} from './storage';

// Todo utilities
export {
  createTodo,
  updateTodo,
  filterTodos,
  sortTodos,
  sortTodosWithCompletedLast,
  calculateTodoCounts,
  findTodoById,
  toggleTodoCompletion,
  getCompletedTodos,
  getActiveTodos,
  removeTodoById,
  removeCompletedTodos,
  updateTodoInArray
} from './todo';

// Date utilities
export {
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  getDateDescription
} from './date';

// Focus utilities
export {
  getFocusableElements,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  createFocusTrap,
  FocusManager
} from './focus';