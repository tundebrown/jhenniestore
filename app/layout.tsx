import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientProviders from '@/components/shared/client-providers';
import { getSetting } from '@/lib/actions/setting.actions';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Jhennie Store',
  description: 'Online Store for Beauty Products',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await getSetting();
  const currencyCookie = (await cookies()).get('currency');
  const currency = currencyCookie ? currencyCookie.value : 'NGN';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders setting={{ ...setting, currency }}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
