'use client';

import { useRouter } from 'next/navigation';

export default function ClearAuthPage() {
  const router = useRouter();

  const handleClear = async () => {
    // Clear cookie by calling logout
    await fetch('/api/auth/logout', { method: 'POST' });
    
    // Redirect to home
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Clear Authentication</h1>
        <p className="text-gray-600">Click the button below to clear your auth session</p>
        <button
          onClick={handleClear}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Clear Auth & Logout
        </button>
      </div>
    </div>
  );
}
