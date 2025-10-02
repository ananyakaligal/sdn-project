import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNMP Dashboard',
  description: 'SNMP-monitored microservices dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

