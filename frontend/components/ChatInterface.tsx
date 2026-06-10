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
    "Hello! I'm **Nexus**, the iNextLabs AI Support Assistant.\n\nI'm here to help you with questions about our services, account management, billing, APIs, and more.\n\nHow can I assist you today?",
  timestamp: new Date(),
};

const SUGGESTIONS = [
  'How do I get started?',
  'What pricing plans are available?',
  'How do I get an API key?',
  'Is my data private?',
];

export default function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
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
      setShowSuggestions(false);

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
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
            sources: response.sources,
          },
        ]);
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
      try { await clearSession(sessionId); } catch { /* ignore */ }
    }
    const newId = await createSession();
    setSessionId(newId);
    setMessages([WELCOME]);
    setError(null);
    setShowSuggestions(true);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Customer Support
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
            Powered by iNextLabs AI
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
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          + New Chat
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          minHeight: '400px',
          maxHeight: 'calc(100vh - 320px)',
        }}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Suggestion chips — shown only before first user message */}
        {showSuggestions && (
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}
            aria-label="Suggested questions"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
            aria-label="Nexus is typing"
            role="status"
          >
            <div
              style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden', border: '1.5px solid rgba(255,107,53,0.4)',
                boxShadow: '0 0 10px rgba(255,107,53,0.2)',
              }}
              aria-hidden="true"
            >
              <img src="https://cdn.inextlabs.ai/images/icons/favicon.png" alt="" width={34} height={34} style={{ objectFit: 'cover', display: 'block' }} />
            </div>
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: '4px 16px 16px 16px',
                border: '1px solid var(--color-border)',
                display: 'flex', gap: '5px', alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)', display: 'inline-block',
                    animation: `nexus-bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 16px', borderRadius: '8px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', fontSize: '14px',
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

      <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-text-disabled)', margin: 0 }}>
        Nexus can make mistakes. Verify important information at{' '}
        <a href="https://www.inextlabs.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>inextlabs.ai</a>
      </p>

      <style>{`
        @keyframes nexus-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
