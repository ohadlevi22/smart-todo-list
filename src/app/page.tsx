import { Suspense } from 'react';
import { TodoApp } from '../components';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoApp />
    </Suspense>
  );
}