'use client';

import { useEffect, useState } from 'react';

import ChatInterface from '@/components/ChatInterface';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
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
      }}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatInterface />
      </main>
    </div>
  );
}
