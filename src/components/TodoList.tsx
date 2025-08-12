'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { TodoListProps } from '../types';
import { TodoItem } from './TodoItem';
import { Button } from './ui';
import { sortTodosWithCompletedLast, ARIA_LABELS, CSS_CLASSES } from '../utils';

/**
 * Empty state component
 */
const EmptyState: React.FC<{
  filter: TodoListProps['filter'];
  onFilterChange?: (filter: 'all') => void;
}> = ({ filter, onFilterChange }) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return {
          title: 'No active todos',
          description: 'All your todos are completed! Great job!',
        };
      case 'completed':
        return {
          title: 'No completed todos',
          description: 'Complete some todos to see them here.',
        };
      default:
        return {
          title: 'No todos yet',
          description: 'Add your first todo to get started.',
        };
    }
  };

  const { title, description } = getEmptyMessage();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {description}
        </p>

        {/* Action button for filtered views */}
        {filter !== 'all' && onFilterChange && (
          <Button
            variant="secondary"
            onClick={() => onFilterChange('all')}
            aria-label="View all todos"
          >
            View All Todos
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-2 text-gray-500">
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm">Loading todos...</span>
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{
  error: NonNullable<TodoListProps['error']>;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-sm">
      {/* Error icon */}
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Error content */}
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-red-700 mb-6">
        {error.message}
      </p>

      {/* Retry button */}
      {error.retryable && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          aria-label="Retry operation"
        >
          Try Again
        </Button>
      )}
    </div>
  </div>
);

/**
 * TodoList component for displaying and managing todos
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  loading = false,
  error = null,
  onToggle,
  onEdit,
  onDelete,
  editingId = null,
  className = '',
}) => {
  // Sort todos with completed items at the bottom
  const sortedTodos = useMemo(() => {
    return sortTodosWithCompletedLast(todos);
  }, [todos]);

  // Handle item-specific actions
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(editingId);

  const handleStartEdit = useCallback((id: string) => {
    setCurrentEditingId(id);
  }, []);

  const handleSaveEdit = useCallback((id: string, newText: string) => {
    onEdit(id, newText);
    setCurrentEditingId(null);
  }, [onEdit]);

  const handleCancelEdit = useCallback((_id: string) => {
    setCurrentEditingId(null);
  }, []);

  // Container classes
  const containerClasses = [
    'todo-list-container',
    className,
  ].filter(Boolean).join(' ');

  // Show loading state
  if (loading && todos.length === 0) {
    return (
      <div className={containerClasses}>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={containerClasses}>
        <ErrorState 
          error={error} 
          onRetry={error.retryable ? () => window.location.reload() : undefined}
        />
      </div>
    );
  }

  // Show empty state
  if (todos.length === 0) {
    return (
      <div className={containerClasses}>
        <EmptyState filter={filter} />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* List header for screen readers */}
      <div className="sr-only">
        <h2>{ARIA_LABELS.TODO_LIST}</h2>
        <p>
          {todos.length === 1 
            ? '1 todo item' 
            : `${todos.length} todo items`
          }
          {filter !== 'all' && ` (filtered by ${filter})`}
        </p>
      </div>

      {/* Todo list */}
      <ul
        className="space-y-2"
        role="list"
        aria-label={`${ARIA_LABELS.TODO_LIST} - ${filter} todos`}
      >
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={currentEditingId === todo.id}
            onToggle={onToggle}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDelete={onDelete}
            tabIndex={0}
            className={CSS_CLASSES.ANIMATE_ENTER}
          />
        ))}
      </ul>

      {/* Loading indicator for updates */}
      {loading && todos.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
};