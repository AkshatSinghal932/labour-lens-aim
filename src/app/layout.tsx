
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import MainLayout from '@/components/MainLayout';
import AppInitializer from '@/components/AppInitializer'; // AppInitializer handles useEffect for seeding

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Labour Lens',
  description: 'Report and track labour exploitation issues in your locality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <AppInitializer>
            <MainLayout>
              {children}
            </MainLayout>
          </AppInitializer>
        </LanguageProvider>
      </body>
    </html>
  );
}
