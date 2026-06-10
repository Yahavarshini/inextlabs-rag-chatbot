'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const resolved = stored ?? 'dark';
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-page)',
        color: 'var(--color-text-primary)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatInterface />
      </main>
    </div>
  );
}
