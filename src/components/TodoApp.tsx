'use client';

import React, { useEffect } from 'react';
import type { TodoAppProps } from '../types';
import { useTodos, useFilter, useKeyboard } from '../hooks';
import { ErrorBoundary } from './ui';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFilters } from './TodoFilters';
import { APP_CONFIG, KEYBOARD_SHORTCUTS, CSS_CLASSES } from '../utils';

/**
 * Main TodoApp component orchestrating all functionality
 */
export const TodoApp: React.FC<TodoAppProps> = ({
  className = '',
  initialTodos = [],
}) => {
  // Initialize hooks
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    deleteCompleted,
    getCounts,
  } = useTodos(initialTodos);

  const {
    currentFilter,
    setFilter,
    getFilteredTodos: filterTodos,
  } = useFilter();

  const { registerHandler } = useKeyboard();

  // Get filtered todos and counts
  const filteredTodos = filterTodos(todos);
  const counts = getCounts();
  
  // Wrapper function for clear completed to match expected type
  const handleClearCompleted = () => {
    deleteCompleted();
  };

  // Register global keyboard shortcuts
  useEffect(() => {
    if (!APP_CONFIG.enableKeyboardShortcuts) return;

    const unregisterHandlers = [
      // Filter shortcuts
      registerHandler({
        key: `Alt+${KEYBOARD_SHORTCUTS.SHOW_ALL}`,
        handler: () => setFilter('all'),
        preventDefault: true,
      }),
      registerHandler({
        key: `Alt+${KEYBOARD_SHORTCUTS.SHOW_ACTIVE}`,
        handler: () => setFilter('active'),
        preventDefault: true,
      }),
      registerHandler({
        key: `Alt+${KEYBOARD_SHORTCUTS.SHOW_COMPLETED}`,
        handler: () => setFilter('completed'),
        preventDefault: true,
      }),
    ];

    return () => {
      unregisterHandlers.forEach(cleanup => cleanup());
    };
  }, [registerHandler, setFilter]);


  // Error fallback component
  const ErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
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
        
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Application Error
        </h3>
        
        <p className="text-sm text-red-700 mb-6">
          {process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Something went wrong. Please refresh the page.'}
        </p>
        
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const containerClasses = [
    'todo-app',
    'min-h-screen bg-gray-50 py-8',
    className,
  ].filter(Boolean).join(' ');

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div className={containerClasses}>
        <div className={CSS_CLASSES.TODO_CONTAINER}>
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Todo List
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Stay organized and get things done
            </p>
            
            {/* Keyboard shortcuts hint */}
            {APP_CONFIG.enableKeyboardShortcuts && (
              <div className="mt-3 text-xs text-gray-500">
                <details className="inline-block">
                  <summary className="cursor-pointer hover:text-gray-700">
                    Keyboard shortcuts
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md text-left max-w-sm mx-auto">
                    <div className="space-y-1">
                      <div><kbd className="px-1 bg-white border rounded">Alt+A</kbd> - Show all</div>
                      <div><kbd className="px-1 bg-white border rounded">Alt+T</kbd> - Show active</div>
                      <div><kbd className="px-1 bg-white border rounded">Alt+C</kbd> - Show completed</div>
                      <div><kbd className="px-1 bg-white border rounded">Enter</kbd> - Edit todo</div>
                      <div><kbd className="px-1 bg-white border rounded">Space</kbd> - Toggle completion</div>
                      <div><kbd className="px-1 bg-white border rounded">Delete</kbd> - Remove todo</div>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Todo input */}
            <div className="p-6 border-b border-gray-200">
              <TodoInput
                onSubmit={addTodo}
                loading={loading}
                placeholder="What needs to be done?"
                maxLength={APP_CONFIG.maxTodoLength}
                autoFocus
                className="w-full"
              />
            </div>

            {/* Todo list */}
            <div className="min-h-[200px]">
              <TodoList
                todos={filteredTodos}
                filter={currentFilter}
                loading={loading}
                error={error}
                onToggle={toggleTodo}
                onEdit={updateTodo}
                onDelete={deleteTodo}
                className="p-6"
              />
            </div>

            {/* Todo filters */}
            {todos.length > 0 && (
              <TodoFilters
                currentFilter={currentFilter}
                onFilterChange={setFilter}
                counts={counts}
                onClearCompleted={counts.completed > 0 ? handleClearCompleted : undefined}
                showStats={true}
                showClearCompleted={true}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-500">
            <p>
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
            <p className="mt-1">
              Data is stored locally in your browser
            </p>
          </footer>

          {/* Screen reader announcements */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {loading && 'Loading...'}
            {error && `Error: ${error.message}`}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};