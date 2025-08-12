'use client';

import React, { useCallback } from 'react';
import type { TodoFiltersProps, FilterType } from '../types';
import { Button } from './ui';
import { ARIA_LABELS, CSS_CLASSES } from '../utils';

/**
 * Filter button component
 */
const FilterButton: React.FC<{
  filter: FilterType;
  isActive: boolean;
  count: number;
  onClick: (filter: FilterType) => void;
}> = ({ filter, isActive, count, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(filter);
  }, [filter, onClick]);

  const getFilterLabel = (filter: FilterType): string => {
    switch (filter) {
      case 'all': return 'All';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
    }
  };

  const label = getFilterLabel(filter);
  const ariaLabel = `Show ${label.toLowerCase()} todos (${count})`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
        ${isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
        }
        ${CSS_CLASSES.FOCUS_RING}
      `}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs ${
          isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

/**
 * Statistics display component
 */
const TodoStats: React.FC<{
  counts: TodoFiltersProps['counts'];
}> = ({ counts }) => {
  const getStatsText = (): string => {
    if (counts.all === 0) {
      return 'No todos yet';
    }

    const parts: string[] = [];
    
    if (counts.active > 0) {
      parts.push(`${counts.active} active`);
    }
    
    if (counts.completed > 0) {
      parts.push(`${counts.completed} completed`);
    }

    if (parts.length === 0) {
      return `${counts.all} todo${counts.all === 1 ? '' : 's'}`;
    }

    return parts.join(', ');
  };

  return (
    <div 
      className="text-sm text-gray-500"
      aria-label={ARIA_LABELS.TODO_STATS}
      role="status"
      aria-live="polite"
    >
      {getStatsText()}
    </div>
  );
};

/**
 * TodoFilters component for filter controls and statistics
 */
export const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts,
  onClearCompleted,
  className = '',
  showStats = true,
  showClearCompleted = true,
}) => {
  const handleClearCompleted = useCallback(() => {
    if (onClearCompleted && counts.completed > 0) {
      onClearCompleted();
    }
  }, [onClearCompleted, counts.completed]);

  const containerClasses = [
    'todo-filters-container',
    'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 border-t border-gray-200',
    className,
  ].filter(Boolean).join(' ');

  const hasCompletedTodos = counts.completed > 0;

  return (
    <div className={containerClasses}>
      {/* Left side - Statistics */}
      {showStats && (
        <div className="flex-shrink-0">
          <TodoStats counts={counts} />
        </div>
      )}

      {/* Center - Filter buttons */}
      <div 
        className="flex gap-1 justify-center sm:justify-start"
        role="group"
        aria-label={ARIA_LABELS.FILTER_CONTROLS}
      >
        <FilterButton
          filter="all"
          isActive={currentFilter === 'all'}
          count={counts.all}
          onClick={onFilterChange}
        />
        <FilterButton
          filter="active"
          isActive={currentFilter === 'active'}
          count={counts.active}
          onClick={onFilterChange}
        />
        <FilterButton
          filter="completed"
          isActive={currentFilter === 'completed'}
          count={counts.completed}
          onClick={onFilterChange}
        />
      </div>

      {/* Right side - Clear completed button */}
      {showClearCompleted && (
        <div className="flex-shrink-0 flex justify-center sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCompleted}
            disabled={!hasCompletedTodos}
            aria-label={`Clear ${counts.completed} completed todo${counts.completed === 1 ? '' : 's'}`}
            className="text-gray-600 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Clear Completed
            {hasCompletedTodos && (
              <span className="ml-1 text-xs">({counts.completed})</span>
            )}
          </Button>
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite">
        {currentFilter !== 'all' && `Showing ${currentFilter} todos`}
        {counts.all === 0 && 'No todos to display'}
      </div>
    </div>
  );
};