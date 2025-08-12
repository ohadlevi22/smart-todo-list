'use client';

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import type { TodoItemProps } from '../types';
import { Button } from './ui';
import { 
  validateTodoText, 
  formatDate, 
  getRelativeTime, 
  CSS_CLASSES, 
  KEYBOARD_SHORTCUTS 
} from '../utils';

/**
 * TodoItem component with inline editing capabilities and accessibility
 */
export const TodoItem = memo<TodoItemProps>(({
  todo,
  isEditing = false,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  className = '',
  tabIndex = 0,
}) => {
  const [editValue, setEditValue] = useState(todo.text);
  const [error, setError] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  // Focus edit input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // Handle toggle completion
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  // Handle edit mode activation
  const handleStartEdit = useCallback(() => {
    if (!isEditing) {
      setEditValue(todo.text);
      setError(null);
      onStartEdit(todo.id);
    }
  }, [todo.id, todo.text, isEditing, onStartEdit]);

  // Handle save edit
  const handleSaveEdit = useCallback(() => {
    if (!isEditing) return;

    const validation = validateTodoText(editValue);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      editInputRef.current?.focus();
      return;
    }

    setError(null);
    onSaveEdit(todo.id, validation.sanitized || editValue);
  }, [todo.id, editValue, isEditing, onSaveEdit]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditValue(todo.text);
    setError(null);
    onCancelEdit(todo.id);
  }, [todo.id, todo.text, onCancelEdit]);

  // Handle delete
  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  // Handle edit input changes
  const handleEditChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
    if (error) {
      setError(null);
    }
  }, [error]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (isEditing) {
      switch (event.key) {
        case KEYBOARD_SHORTCUTS.SAVE_EDIT:
          event.preventDefault();
          handleSaveEdit();
          break;
        case KEYBOARD_SHORTCUTS.CANCEL_EDIT:
          event.preventDefault();
          handleCancelEdit();
          break;
      }
    } else {
      switch (event.key) {
        case KEYBOARD_SHORTCUTS.TOGGLE_TODO:
        case ' ':
          event.preventDefault();
          handleToggle();
          break;
        case 'Enter':
          event.preventDefault();
          handleStartEdit();
          break;
        case KEYBOARD_SHORTCUTS.DELETE_TODO:
          event.preventDefault();
          handleDelete();
          break;
      }
    }
  }, [isEditing, handleSaveEdit, handleCancelEdit, handleToggle, handleStartEdit, handleDelete]);

  // Handle edit form submission
  const handleEditSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSaveEdit();
  }, [handleSaveEdit]);

  // Dynamic classes based on state
  const itemClasses = [
    'group todo-item bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
    todo.completed ? 'opacity-75' : '',
    isEditing ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:border-gray-300',
    CSS_CLASSES.TRANSITION,
    className,
  ].filter(Boolean).join(' ');

  const textClasses = [
    'flex-1 text-sm text-gray-900 transition-all duration-200',
    todo.completed ? 'line-through text-gray-500' : '',
    'break-words',
  ].filter(Boolean).join(' ');

  const createdDate = new Date(todo.createdAt);
  const updatedDate = new Date(todo.updatedAt);
  const isUpdated = updatedDate.getTime() !== createdDate.getTime();

  return (
    <li
      ref={itemRef}
      className={itemClasses}
      role="listitem"
      tabIndex={isEditing ? -1 : tabIndex}
      onKeyDown={!isEditing ? handleKeyDown : undefined}
      aria-label={`Todo: ${todo.text}. ${todo.completed ? 'Completed' : 'Not completed'}`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Completion checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isEditing}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${CSS_CLASSES.FOCUS_RING} ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400 bg-white'
          }`}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          tabIndex={isEditing ? -1 : 0}
        >
          {todo.completed && (
            <svg
              className="w-3 h-3"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.281 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
          )}
        </button>

        {/* Todo content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            // Edit mode
            <form onSubmit={handleEditSubmit}>
              <input
                ref={editInputRef}
                type="text"
                value={editValue}
                onChange={handleEditChange}
                onKeyDown={handleKeyDown}
                className={`w-full px-2 py-1 text-sm border rounded ${CSS_CLASSES.FOCUS_RING} ${
                  error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                aria-label="Edit todo text"
                aria-describedby={error ? 'edit-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
              />
              
              {error && (
                <div id="edit-error" className="mt-1 text-xs text-red-600" role="alert">
                  {error}
                </div>
              )}
              
              {/* Edit actions */}
              <div className="flex gap-2 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  aria-label="Save changes"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                  aria-label="Cancel editing"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // Display mode
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className={`${textClasses} text-left w-full hover:text-gray-700 ${CSS_CLASSES.FOCUS_RING} rounded px-1 py-0.5 -mx-1`}
                aria-label={`Edit todo: ${todo.text}`}
                tabIndex={-1}
              >
                {todo.text}
              </button>
              
              {/* Timestamp */}
              <div className="mt-1 text-xs text-gray-400">
                <time
                  dateTime={todo.createdAt}
                  title={formatDate(createdDate, 'long')}
                >
                  Created {getRelativeTime(createdDate)}
                </time>
                {isUpdated && (
                  <>
                    {' • '}
                    <time
                      dateTime={todo.updatedAt}
                      title={formatDate(updatedDate, 'long')}
                    >
                      Updated {getRelativeTime(updatedDate)}
                    </time>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              aria-label={`Edit ${todo.text}`}
              className="!p-1.5 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete ${todo.text}`}
              className="!p-1.5 text-gray-400 hover:text-red-600"
              tabIndex={-1}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 012 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </li>
  );
});

TodoItem.displayName = 'TodoItem';