'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/components/auth-provider';
import { Navbar } from '@/widgets/header/navbar/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Clear any stale cookies and redirect to login
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        router.push('/login');
        router.refresh();
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900 dark:text-gray-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-900 dark:text-gray-100">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed background for iOS safe area (notch) */}
      <div 
        className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-40"
        style={{ 
          height: 'env(safe-area-inset-top)',
          minHeight: '44px' // Fallback for devices without notch
        }}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
