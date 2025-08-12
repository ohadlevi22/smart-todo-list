'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UseFilterReturn, Todo, FilterType } from '../types';
import { filterTodos, APP_CONFIG } from '../utils';

/**
 * Custom hook for managing filter state with URL synchronization
 */
export function useFilter(): UseFilterReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filter from URL or use default
  const initialFilter = (searchParams?.get('filter') as FilterType) || APP_CONFIG.defaultFilter;
  const [currentFilter, setCurrentFilter] = useState<FilterType>(initialFilter);

  // Set active filter and update URL
  const setFilter = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
    
    if (typeof window === 'undefined') return;
    
    // Update URL with new filter
    const params = new URLSearchParams(searchParams?.toString());
    if (filter === APP_CONFIG.defaultFilter) {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    
    // Use replace to avoid cluttering browser history
    router.replace(newUrl as any, { scroll: false });
  }, [router, searchParams]);

  // Get filtered todos based on current filter
  const getFilteredTodos = useCallback((todos: Todo[]): Todo[] => {
    return filterTodos(todos, currentFilter);
  }, [currentFilter]);

  // Generate filter URLs for bookmarking
  const filterUrls = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        all: '/',
        active: '/?filter=active',
        completed: '/?filter=completed',
      };
    }
    
    const baseUrl = window.location.pathname;
    
    return {
      all: baseUrl,
      active: `${baseUrl}?filter=active`,
      completed: `${baseUrl}?filter=completed`,
    };
  }, []);

  return {
    currentFilter,
    setFilter,
    getFilteredTodos,
    filterUrls,
  };
}