/**
 * Focus management utilities for accessibility
 */

/**
 * Get focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ) as HTMLElement[]

  return focusableElements.filter(element => {
    // Check if element is visible and not hidden
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    )
  })
}

/**
 * Focus the first focusable element
 */
export const focusFirst = (container: HTMLElement = document.body): boolean => {
  const focusableElements = getFocusableElements(container)
  
  if (focusableElements.length > 0) {
    const firstElement = focusableElements[0]
    if (firstElement) {
      firstElement.focus()
      return true
    }
  }
  
  return false
}

/**
 * Focus the last focusable element
 */
export const focusLast = (container: HTMLElement = document.body): boolean => {
  const focusableElements = getFocusableElements(container)
  
  if (focusableElements.length > 0) {
    const lastElement = focusableElements[focusableElements.length - 1]
    if (lastElement) {
      lastElement.focus()
      return true
    }
  }
  
  return false
}

/**
 * Focus the next focusable element
 */
export const focusNext = (currentElement: HTMLElement): boolean => {
  const container = currentElement.closest('[role="dialog"]') as HTMLElement || document.body
  const focusableElements = getFocusableElements(container)
  const currentIndex = focusableElements.indexOf(currentElement)
  
  if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
      return true
    }
  }
  
  return false
}

/**
 * Focus the previous focusable element
 */
export const focusPrevious = (currentElement: HTMLElement): boolean => {
  const container = currentElement.closest('[role="dialog"]') as HTMLElement || document.body
  const focusableElements = getFocusableElements(container)
  const currentIndex = focusableElements.indexOf(currentElement)
  
  if (currentIndex > 0) {
    const previousElement = focusableElements[currentIndex - 1]
    if (previousElement) {
      previousElement.focus()
      return true
    }
  }
  
  return false
}

/**
 * Create a focus trap within a container
 */
export const createFocusTrap = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container)
  
  if (focusableElements.length === 0) {
    return () => {} // Return empty cleanup function
  }
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (!firstElement || !lastElement) {
    return () => {} // Return empty cleanup function if elements are undefined
  }
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
  
  // Focus first element
  firstElement.focus()
  
  // Add event listener
  container.addEventListener('keydown', handleKeyDown)
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Focus manager class for complex focus scenarios
 */
export class FocusManager {
  private previousActiveElement: HTMLElement | null = null
  private trapCleanup: (() => void) | null = null

  /**
   * Store the currently focused element
   */
  storeFocus(): void {
    this.previousActiveElement = document.activeElement as HTMLElement
  }

  /**
   * Restore focus to the previously stored element
   */
  restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus()
      this.previousActiveElement = null
    }
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container: HTMLElement): () => void {
    this.storeFocus()
    this.trapCleanup = createFocusTrap(container)
    
    return () => {
      if (this.trapCleanup) {
        this.trapCleanup()
        this.trapCleanup = null
      }
    }
  }

  /**
   * Clear all focus management
   */
  clear(): void {
    if (this.trapCleanup) {
      this.trapCleanup()
      this.trapCleanup = null
    }
    this.previousActiveElement = null
  }
}