import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Dahiyoo | Chill Out With Our Swirls of Flavours',
  description: 'Fresh fruit frozen yogurt. No artificial colors. Real yogurt. Real fruit. Available in Vasai-Virar and on Zomato.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="antialiased font-dm-sans bg-orange">{children}</body>
    </html>
  );
}
