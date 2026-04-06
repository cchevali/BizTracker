import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteUrl, withBasePath } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Acquisition Tracker",
  description:
    "Local-first acquisition tracker for evaluating, filtering, and updating small-business opportunities.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: withBasePath("/"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="mx-auto flex min-h-full w-full max-w-[1500px] flex-col px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
