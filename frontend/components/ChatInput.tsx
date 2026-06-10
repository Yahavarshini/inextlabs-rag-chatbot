'use client';

import { KeyboardEvent, useRef, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        padding: '12px 16px',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        transition: 'border-color 0.2s ease',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
      onFocusCapture={(e) => (e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)')}
      onBlurCapture={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      role="form"
      aria-label="Chat input"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Ask about iNextLabs services, billing, APIs..."
        disabled={isLoading}
        aria-label="Type your message"
        rows={1}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          fontSize: '14px',
          lineHeight: '1.6',
          resize: 'none',
          fontFamily: 'var(--font-body)',
          minHeight: '24px',
          maxHeight: '120px',
          overflowY: 'auto',
        }}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          border: 'none',
          background: canSend
            ? 'linear-gradient(135deg, #ff6b35, #ff8c42)'
            : 'var(--color-bg-muted)',
          color: canSend ? '#ffffff' : 'var(--color-text-disabled)',
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
          boxShadow: canSend ? '0 4px 12px rgba(255,107,53,0.4)' : 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
