# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Next.js development server on localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server (requires build first)

### Code Quality
- `npm run lint` - Run ESLint for code linting
- `npm run type-check` - Run TypeScript compiler for type checking (no emit)

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React hooks with localStorage persistence
- **Build**: Configured for Vercel deployment

### Project Structure
The codebase follows a modular architecture with clear separation of concerns:

- **src/app/** - Next.js App Router pages and layouts
  - `page.tsx` - Main entry point, renders TodoApp in Suspense boundary
  - `layout.tsx` - Root layout with metadata
  - `globals.css` - Global styles and Tailwind imports

- **src/components/** - React components organized by feature
  - `TodoApp.tsx` - Main orchestrator component managing all todo functionality
  - `TodoInput.tsx`, `TodoList.tsx`, `TodoItem.tsx`, `TodoFilters.tsx` - Feature components
  - `ui/` - Reusable UI components (Button, Modal, ErrorBoundary)
  - All components use TypeScript interfaces from `src/types/`

- **src/hooks/** - Custom React hooks for business logic
  - `useTodos.ts` - Core todo CRUD operations with localStorage sync
  - `useLocalStorage.ts` - Persistent state management
  - `useFilter.ts` - Filter state management
  - `useKeyboard.ts` - Keyboard shortcuts handler

- **src/utils/** - Pure utility functions and constants
  - `constants.ts` - Central configuration (APP_CONFIG, KEYBOARD_SHORTCUTS, ERROR_MESSAGES)
  - `todo.ts` - Todo manipulation functions (createTodo, filterTodos, etc.)
  - `validation.ts` - Input validation logic
  - `storage.ts` - localStorage wrapper functions

- **src/types/** - TypeScript type definitions
  - Comprehensive type definitions for all components, hooks, and utilities
  - Strict typing with no implicit any

### Key Patterns

1. **State Management**: All todo state is managed through the `useTodos` hook which synchronizes with localStorage. The hook returns loading states, error handling, and CRUD operations.

2. **Error Handling**: Structured error states with types (VALIDATION_ERROR, STORAGE_ERROR, etc.) and user-friendly messages. Components use ErrorBoundary for graceful failure recovery.

3. **Keyboard Shortcuts**: Global shortcuts managed through `useKeyboard` hook with configurable bindings in constants (Alt+A for all, Alt+T for active, Alt+C for completed).

4. **Data Flow**: Unidirectional data flow where TodoApp orchestrates state and passes down props to child components. No prop drilling - direct parent-child relationships only.

5. **TypeScript Configuration**: Strict mode enabled with additional safety flags (noUncheckedIndexedAccess, noImplicitReturns). Path alias `@/*` maps to `./src/*`.

### Important Constants

- **Storage Key**: `todo-app-todos` (localStorage)
- **Max Todo Length**: 500 characters
- **Auto-save Delay**: 1000ms
- **Default Filter**: 'all'