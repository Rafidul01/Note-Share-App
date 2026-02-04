
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">Sign in to NoteApp</h2>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-900 dark:text-gray-100">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
