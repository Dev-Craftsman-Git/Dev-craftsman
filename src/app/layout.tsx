import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/themes/ThemeProvider';
import Navbar from '@/components/sections/Navbar';
import ParticleBackground from '@/components/effects/ParticleBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

import { getSectionVisibility, getActiveTheme } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dev Craftsman - Unleash Your Project Superpowers',
  description: 'Premium custom tech project implementation for students and businesses.',
  icons: {
    icon: '/favicon.png',
  },
};



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPricing, activeThemeId] = await Promise.all([
    getSectionVisibility('home', 'pricing'),
    getActiveTheme()
  ]);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebas.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider initialThemeId={activeThemeId}>
          <ParticleBackground />
          <Navbar showPricing={showPricing} />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
