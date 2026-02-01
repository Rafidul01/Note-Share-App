'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '../actions/register';
import { useToast } from '@/shared/ui/toast/toast-provider';

export function RegisterForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await registerAction({ email, password, displayName });

      if (result.success) {
        showToast('Account created successfully! Welcome aboard.', 'success');
        
        // Wait for toast to show, then do a full page navigation
        setTimeout(() => {
          window.location.href = '/notes';
        }, 500);
      } else {
        showToast(result.error || 'Registration failed', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('An unexpected error occurred', 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
