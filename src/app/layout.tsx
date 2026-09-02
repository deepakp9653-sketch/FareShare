import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GroupTrip Ledger — Event-Sourced Group Travel & Settlement Platform',
  description: 'Fintech Precision × Travel Warmth. Dynamic Split Primitive Engine & Debt Simplification Visualizer.',
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
