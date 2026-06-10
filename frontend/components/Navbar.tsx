import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        backgroundColor: 'var(--color-bg-page)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      role="banner"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '100%',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 24V8l16 16H8z" fill="white" />
            <path
              d="M24 8v16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.2,
              }}
            >
              iNextLabs
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              Support Assistant
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-primary-light)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-primary)',
            }}
            aria-label="Service status: Online"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                display: 'inline-block',
              }}
              aria-hidden="true"
            />
            Online
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
