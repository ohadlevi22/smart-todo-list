/**
 * Storage utilities for localStorage operations
 */

/**
 * Result type for storage operations
 */
export interface StorageResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    
    const test = '__storage_test__'
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get item from localStorage with JSON parsing
 */
export const getStorageItem = <T>(key: string): StorageResult<T> => {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage not available',
      }
    }

    const item = window.localStorage.getItem(key)
    
    if (item === null) {
      // Return success with undefined data to indicate no value exists
      return {
        success: true,
        data: undefined,
      }
    }

    const data = JSON.parse(item) as T
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get item',
    }
  }
}

/**
 * Set item in localStorage with JSON serialization
 */
export const setStorageItem = <T>(key: string, value: T): StorageResult => {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage not available',
      }
    }

    const serialized = JSON.stringify(value)
    window.localStorage.setItem(key, serialized)
    
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set item',
    }
  }
}

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): StorageResult => {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage not available',
      }
    }

    window.localStorage.removeItem(key)
    
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove item',
    }
  }
}

/**
 * Clear all localStorage
 */
export const clearStorage = (): StorageResult => {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage not available',
      }
    }

    window.localStorage.clear()
    
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear storage',
    }
  }
}

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  if (!isStorageAvailable()) {
    return {
      available: false,
      used: 0,
      remaining: 0,
      total: 0,
    }
  }

  try {
    let used = 0
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        used += window.localStorage.getItem(key)?.length || 0
        used += key.length
      }
    }

    // Estimate total available space (this is browser-dependent)
    const total = 5 * 1024 * 1024 // ~5MB typical limit
    
    return {
      available: true,
      used,
      remaining: total - used,
      total,
    }
  } catch {
    return {
      available: true,
      used: 0,
      remaining: 0,
      total: 0,
    }
  }
}