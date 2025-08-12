import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { I18nProvider } from '../../contexts/I18nContext';
import {notFound} from 'next/navigation';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Move It",
  description: "Your prior task manager",
};

const locales = ['en', 'fr', 'rw'] as const;
type Locale = typeof locales[number];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const {locale} = params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  // Load messages directly
  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider locale={locale as Locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
