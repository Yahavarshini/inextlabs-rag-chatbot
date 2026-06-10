import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: 'dark' | 'light';
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
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
        {/* Brand — real iNextLabs logo from CDN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://cdn.inextlabs.ai/images/icons/favicon.png"
            alt="iNextLabs"
            width={36}
            height={36}
            style={{ borderRadius: '8px', objectFit: 'contain' }}
          />
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
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
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
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
              padding: '5px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#10B981',
              letterSpacing: '0.02em',
            }}
            aria-label="Service status: Online"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
                boxShadow: '0 0 6px #10B981',
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
