import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { I18nProvider } from '../../contexts/I18nContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import ToastNotification from '../../components/ToastNotification';
import {notFound} from 'next/navigation';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <I18nProvider locale={locale as Locale} messages={messages}>
            <AuthProvider>
              <NotificationProvider>
                <ToastNotification />
                {children}
              </NotificationProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
