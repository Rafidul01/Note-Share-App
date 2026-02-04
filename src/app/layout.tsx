import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ToastProvider } from "@/shared/ui/toast/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NoteApp - Your Personal Note Taking App",
  description: "Create, organize, and share notes with ease",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // This enables safe area insets
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-50 dark:bg-gray-900">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
