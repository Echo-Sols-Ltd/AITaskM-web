import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
