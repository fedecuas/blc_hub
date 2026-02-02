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
import DataRecoveryGuard from "@/components/DataRecoveryGuard";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, AuthGuard } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';


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
              <DataRecoveryGuard>
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
              </DataRecoveryGuard>
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
