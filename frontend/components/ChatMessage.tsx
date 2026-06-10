import type { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

function renderContent(content: string): React.ReactNode[] {
  return content.split('\n').map((line, lineIndex) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, partIndex) =>
      partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part,
    );
    return (
      <span key={lineIndex}>
        {rendered}
        {lineIndex < content.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      {/* Assistant avatar */}
      {!isUser && (
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
      )}

      <div
        style={{
          maxWidth: '72%',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '16px 16px 0 16px' : '16px 16px 16px 0',
            backgroundColor: isUser
              ? 'var(--color-primary)'
              : 'var(--color-bg-page)',
            color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
            border: isUser ? 'none' : '1px solid var(--color-border)',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {renderContent(message.content)}
        </div>

        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-disabled)',
          }}
          aria-label={`Sent at ${message.timestamp.toLocaleTimeString()}`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
