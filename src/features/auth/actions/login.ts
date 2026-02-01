'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/shared/config/firebase-admin';

export async function loginAction(credentials: { email: string; password: string }) {
  try {
    // Firebase Auth REST API for email/password sign-in
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    // Verify the ID token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(data.idToken);

    // Set JWT token in HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('token', data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, uid: decodedToken.uid };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message || 'Invalid email or password' 
    };
  }
}
