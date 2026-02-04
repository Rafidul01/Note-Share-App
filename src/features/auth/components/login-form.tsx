'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions/login';
import { useToast } from '@/shared/ui/toast/toast-provider';

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginAction({ email, password });

    if (result.success) {
      showToast('Login successful! Welcome back.', 'success');
      
      // Wait for toast to show, then do a full page navigation
      setTimeout(() => {
        window.location.href = '/notes';
      }, 500);
    } else {
      showToast(result.error || 'Login failed', 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
