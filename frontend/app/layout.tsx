import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InextLabs Support Chat',
  description: 'AI-powered customer support chatbot for InextLabs services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
