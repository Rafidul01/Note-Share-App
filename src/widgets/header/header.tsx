'use client';

import { useAuthContext } from '@/features/auth/components/auth-provider';
import { logoutAction } from '@/features/auth/actions/logout';

export function Header() {
  const { user } = useAuthContext();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold">NoteApp</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
