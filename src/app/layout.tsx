import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Move It",
  description: "Your prior task manager",
};

// This layout only applies to the root redirect page
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dancingScript.className}>
        {children}
      </body>
    </html>
  );
}
