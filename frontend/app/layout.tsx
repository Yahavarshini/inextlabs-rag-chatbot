import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iNextLabs — Support Assistant',
  description: 'AI-powered customer support chatbot for iNextLabs services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
