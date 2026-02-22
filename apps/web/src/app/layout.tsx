import type { Metadata } from "next";

import { Inter, JetBrains_Mono } from "next/font/google";

import "./index.css";
import Providers from "@/components/providers";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "talentra",
  description: "talentra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*<head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
      </head>*/}
      <body
        className={`${interSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
