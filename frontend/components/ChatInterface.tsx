'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { clearSession, createSession, sendMessage } from '@/lib/api';
import type { Message } from '@/lib/types';

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm **Nexus**, the InextLabs AI Support Assistant.\n\nI'm here to help you with questions about our services, account management, billing, APIs, and more.\n\nHow can I assist you today?",
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSession().then(setSessionId).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendMessage(sessionId, text);
        if (!sessionId) setSessionId(response.session_id);

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          sources: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setError('Failed to get a response. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading],
  );

  const handleNewChat = useCallback(async () => {
    if (sessionId) {
      try {
        await clearSession(sessionId);
      } catch {
        // Ignore errors when clearing old session
      }
    }
    const newId = await createSession();
    setSessionId(newId);
    setMessages([WELCOME]);
    setError(null);
  }, [sessionId]);

  return (
    <div
      style={{
        maxWidth: '860px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Customer Support
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0',
            }}
          >
            Powered by InextLabs AI
          </p>
        </div>

        <button
          onClick={handleNewChat}
          aria-label="Start a new conversation"
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          New Chat
        </button>
      </div>

      {/* Messages container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          minHeight: '420px',
          maxHeight: 'calc(100vh - 310px)',
        }}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
            aria-label="Assistant is typing"
            role="status"
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M8 24V8l16 16H8z" fill="white" />
              </svg>
            </div>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-bg-page)',
                borderRadius: '16px 16px 16px 0',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'inline-block',
                    animation: `nexus-bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: 'var(--color-error)',
              fontSize: '14px',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />

      <style>{`
        @keyframes nexus-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
