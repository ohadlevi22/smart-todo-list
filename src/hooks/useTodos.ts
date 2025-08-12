'use client';

import { useState, useCallback } from 'react';
import type { UseTodosReturn, Todo, FilterType, ErrorState } from '../types';
import { useLocalStorage } from './useLocalStorage';
import {
  createTodo,
  filterTodos,
  calculateTodoCounts,
  findTodoById,
  removeTodoById,
  removeCompletedTodos,
  updateTodoInArray,
  validateTodoText,
  APP_CONFIG,
  ERROR_MESSAGES,
} from '../utils';

/**
 * Custom hook for todo data management and business logic
 */
export function useTodos(initialTodos: Todo[] = []): UseTodosReturn {
  const { value: storedTodos, setValue: setStoredTodos, error: storageError } = useLocalStorage<Todo[]>(
    APP_CONFIG.storageKey,
    initialTodos
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  // Use stored todos as the source of truth
  const todos = storedTodos;

  // Helper to create error state
  const createError = useCallback((type: ErrorState['type'], message: string, retryable = true): ErrorState => ({
    type,
    message,
    timestamp: new Date().toISOString(),
    retryable,
  }), []);

  // Handle storage errors
  const handleStorageError = useCallback((operation: string) => {
    if (storageError) {
      setError(createError('STORAGE_ERROR', `${operation}: ${storageError}`));
    }
  }, [storageError, createError]);

  // Add new todo
  const addTodo = useCallback(async (text: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const validation = validateTodoText(text);
      
      if (!validation.isValid) {
        setError(createError('VALIDATION_ERROR', validation.error || ERROR_MESSAGES.VALIDATION_ERROR));
        setLoading(false);
        return;
      }

      const newTodo = createTodo(validation.sanitized || text);
      const updatedTodos = [newTodo, ...todos];
      
      setStoredTodos(updatedTodos);
      handleStorageError('Failed to save new todo');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [todos, setStoredTodos, handleStorageError, createError]);

  // Toggle todo completion status
  const toggleTodo = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const todo = findTodoById(todos, id);
      
      if (!todo) {
        setError(createError('NOT_FOUND_ERROR', ERROR_MESSAGES.NOT_FOUND_ERROR, false));
        return;
      }

      const updatedTodos = updateTodoInArray(todos, id, { completed: !todo.completed });
      setStoredTodos(updatedTodos);
      handleStorageError('Failed to update todo');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [todos, setStoredTodos, handleStorageError, createError]);

  // Update todo text
  const updateTodoText = useCallback(async (id: string, text: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const validation = validateTodoText(text);
      
      if (!validation.isValid) {
        setError(createError('VALIDATION_ERROR', validation.error || ERROR_MESSAGES.VALIDATION_ERROR));
        return;
      }

      const todo = findTodoById(todos, id);
      
      if (!todo) {
        setError(createError('NOT_FOUND_ERROR', ERROR_MESSAGES.NOT_FOUND_ERROR, false));
        return;
      }

      const updatedTodos = updateTodoInArray(todos, id, { text: validation.sanitized || text });
      setStoredTodos(updatedTodos);
      handleStorageError('Failed to update todo');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [todos, setStoredTodos, handleStorageError, createError]);

  // Delete single todo
  const deleteTodo = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const todo = findTodoById(todos, id);
      
      if (!todo) {
        setError(createError('NOT_FOUND_ERROR', ERROR_MESSAGES.NOT_FOUND_ERROR, false));
        return;
      }

      const updatedTodos = removeTodoById(todos, id);
      setStoredTodos(updatedTodos);
      handleStorageError('Failed to delete todo');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [todos, setStoredTodos, handleStorageError, createError]);

  // Delete all completed todos
  const deleteCompleted = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodos = removeCompletedTodos(todos);
      setStoredTodos(updatedTodos);
      handleStorageError('Failed to clear completed todos');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [todos, setStoredTodos, handleStorageError, createError]);

  // Clear all todos
  const clearAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      setStoredTodos([]);
      handleStorageError('Failed to clear all todos');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(createError('UNKNOWN_ERROR', message));
    } finally {
      setLoading(false);
    }
  }, [setStoredTodos, handleStorageError, createError]);

  // Get filtered todos based on filter type
  const getFilteredTodos = useCallback((filter: FilterType): Todo[] => {
    return filterTodos(todos, filter);
  }, [todos]);

  // Get todo counts by status
  const getCounts = useCallback(() => {
    return calculateTodoCounts(todos);
  }, [todos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    updateTodo: updateTodoText,
    deleteTodo,
    deleteCompleted,
    clearAll,
    getFilteredTodos,
    getCounts,
  };
}