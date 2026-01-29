"use client";

import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, AuthGuard } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';

// Metadata cannot be exported from a "use client" file. 
// For a pilot this is acceptable, or we can separate the logic. 
// Simplest approach for now: remove metadata export or use a wrapper.
// We will remove metadata export for this client component file for now.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <AuthGuard>
                {isLoginPage ? (
                  children
                ) : (
                  <div className="layout-wrapper">
                    <Sidebar />
                    <main className="main-content">
                      <TopNav />
                      <div className="scroll-area">
                        {children}
                      </div>
                    </main>
                  </div>
                )}
              </AuthGuard>
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
