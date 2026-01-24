'use server';

import { cookies } from 'next/headers';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import { LoginCredentials } from '../types/auth.types';

export async function loginAction(credentials: LoginCredentials) {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Get Firebase ID token (JWT)
    const idToken = await userCredential.user.getIdToken();

    // Set JWT token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
