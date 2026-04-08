import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Corposanpedro | Gestión del Festival',
  description: 'Sistema integral de gestión operativa, presupuestal y de eventos del Festival del Bambuco en San Juan y San Pedro.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} antialiased h-full`}>
      <body className="h-full bg-slate-50 text-slate-900 font-sans flex min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
