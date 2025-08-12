import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo List App',
  description: 'A simple and elegant todo list application built with Next.js, TypeScript, and Tailwind CSS.',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}