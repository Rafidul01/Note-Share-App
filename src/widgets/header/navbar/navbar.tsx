'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/components/auth-provider';
import { logoutAction } from '@/features/auth/actions/logout';
import { useToast } from '@/shared/ui/toast/toast-provider';

export function Navbar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutAction();
    if (result.success) {
      showToast('Logged out successfully', 'success');
      router.push('/login');
      router.refresh();
    } else {
      showToast('Logout failed', 'error');
    }
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

  const navLinks = [
    { href: '/notes', label: 'My Notes', icon: '📝' },
    { href: '/notes/new', label: 'New Note', icon: '➕' },
    { href: '/shared', label: 'Shared', icon: '🔗' },
  ];

  const isActive = (href: string) => pathname === href;

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 sticky top-0 z-50" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/notes" className="flex items-center space-x-2">
              <span className="text-2xl">📔</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NoteApp
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
              >
                {/* Avatar */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900">
                    {getInitials()}
                  </div>
                )}

                {/* User Info - Hidden on mobile */}
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {user.email}
                  </p>
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
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
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20 py-2">
                    {/* User Info in Dropdown - Mobile */}
                    <div className="px-4 py-3 border-b dark:border-gray-700 lg:hidden">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="md:hidden border-b dark:border-gray-700">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive(link.href)
                              ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="mr-3">{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
                    >
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
