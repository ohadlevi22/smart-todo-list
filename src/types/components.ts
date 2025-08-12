import { type Todo, type FilterType, type TodoCounts } from './todo';
import { type ErrorState, type ValidationResult, type ButtonVariant, type ButtonSize } from './app';

/**
 * Root application component props
 */
export interface TodoAppProps {
  /** Optional CSS class name */
  className?: string;
  
  /** Initial todos for testing */
  initialTodos?: Todo[];
  
  /** Initial filter for testing */
  initialFilter?: FilterType;
}

/**
 * Todo list component props
 */
export interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[];
  
  /** Current active filter */
  filter: FilterType;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: ErrorState | null;
  
  /** Todo toggle handler */
  onToggle: (id: string) => void;
  
  /** Todo edit handler */
  onEdit: (id: string, newText: string) => void;
  
  /** Todo delete handler */
  onDelete: (id: string) => void;
  
  /** Edit mode state */
  editingId?: string | null;
  
  /** Optional CSS class name */
  className?: string;
}

/**
 * Todo item component props
 */
export interface TodoItemProps {
  /** Todo data */
  todo: Todo;
  
  /** Whether item is in edit mode */
  isEditing?: boolean;
  
  /** Toggle completion handler */
  onToggle: (id: string) => void;
  
  /** Start editing handler */
  onStartEdit: (id: string) => void;
  
  /** Save edit handler */
  onSaveEdit: (id: string, newText: string) => void;
  
  /** Cancel edit handler */
  onCancelEdit: (id: string) => void;
  
  /** Delete handler */
  onDelete: (id: string) => void;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

/**
 * Todo input component props
 */
export interface TodoInputProps {
  /** Submit handler for new todos */
  onSubmit: (text: string) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** Input placeholder text */
  placeholder?: string;
  
  /** Maximum character limit */
  maxLength?: number;
  
  /** Auto-focus on mount */
  autoFocus?: boolean;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Validation handler */
  onValidate?: (text: string) => ValidationResult;
}

/**
 * Todo filters component props
 */
export interface TodoFiltersProps {
  /** Current active filter */
  currentFilter: FilterType;
  
  /** Filter change handler */
  onFilterChange: (filter: FilterType) => void;
  
  /** Todo count statistics */
  counts: TodoCounts;
  
  /** Clear completed todos handler */
  onClearCompleted?: () => void;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Show statistics */
  showStats?: boolean;
  
  /** Show clear completed button */
  showClearCompleted?: boolean;
}

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  
  /** Size variant */
  size?: ButtonSize;
  
  /** Loading state */
  loading?: boolean;
  
  /** Icon element */
  icon?: React.ReactNode;
  
  /** Icon position */
  iconPosition?: 'left' | 'right';
  
  /** Full width */
  fullWidth?: boolean;
}

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Close handler */
  onClose: () => void;
  
  /** Modal title */
  title?: string;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Close on overlay click */
  closeOnOverlay?: boolean;
  
  /** Close on escape key */
  closeOnEscape?: boolean;
  
  /** Optional CSS class name */
  className?: string;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  /** Child components */
  children: React.ReactNode;
  
  /** Fallback component */
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  
  /** Error handler */
  onError?: (error: ErrorState) => void;
}