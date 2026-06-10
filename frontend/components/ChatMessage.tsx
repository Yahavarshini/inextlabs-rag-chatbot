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
        gap: '10px',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Nexus'} message`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            flexShrink: 0,
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 107, 53, 0.4)',
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.2)',
          }}
          aria-hidden="true"
        >
          <img
            src="https://cdn.inextlabs.ai/images/icons/favicon.png"
            alt="Nexus"
            width={34}
            height={34}
            style={{ objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: '74%',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {!isUser && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            Nexus
          </span>
        )}

        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
            backgroundColor: isUser
              ? 'var(--color-primary)'
              : 'var(--color-bg-card)',
            color: isUser ? '#ffffff' : 'var(--color-text-primary)',
            border: isUser
              ? 'none'
              : '1px solid var(--color-border)',
            fontSize: '14px',
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            boxShadow: isUser
              ? '0 4px 16px rgba(255, 107, 53, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {renderContent(message.content)}
        </div>

        <span
          style={{ fontSize: '11px', color: 'var(--color-text-disabled)' }}
          aria-label={`Sent at ${message.timestamp.toLocaleTimeString()}`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
