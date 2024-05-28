import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

import Header from '@/app/components/Header';
import { Providers } from './components/Providers';

import { cn } from './utils';

export const metadata: Metadata = {
  title: 'R&D-tools',
  description: 'Agile tools for everyday software teams',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('font-sans antialiased', GeistSans.variable, GeistMono.variable)}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in">
            <Header />
            <main className="p-5 flex flex-col flex-1 ">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
