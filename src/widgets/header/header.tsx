'use client';

import { useState } from 'react';
import { useAuthContext } from '@/features/auth/components/auth-provider';
import { logoutAction } from '@/features/auth/actions/logout';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/ui/toast/toast-provider';

export function Header() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    showToast('Logged out successfully', 'success');
    router.push('/');
    router.refresh();
  };

  // Get initials from display name or email
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-blue-600">NoteApp</h1>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              {/* Avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-blue-500">
                  {getInitials()}
                </div>
              )}
              
              {/* User Info */}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              {/* Dropdown Arrow */}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
