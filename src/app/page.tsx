import { Suspense } from 'react';
import { TodoApp } from '../components';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Todo App...</h1>
          <p className="text-gray-600">Please wait a moment</p>
        </div>
      </div>
    }>
      <TodoApp />
    </Suspense>
  );
}