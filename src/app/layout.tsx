import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FareShare — Group Trip Ledger Platform',
  description: 'FinTech Precision × Group Fairness. Dynamic Split Engine & Zero-Sum Settlement Platform.',
  icons: {
    icon: '/fareshare-icon.png',
    shortcut: '/fareshare-icon.png',
    apple: '/fareshare-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-base text-ink-primary min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
