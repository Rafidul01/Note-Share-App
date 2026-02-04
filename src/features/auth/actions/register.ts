'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/shared/config/firebase-admin';
import clientPromise from '@/shared/lib/mongodb';
import { userCollectionName } from '@/entities/user/model/user.schema';
import { RegisterCredentials } from '../types/auth.types';

export async function registerAction(credentials: RegisterCredentials) {
  try {
    // Create user with Firebase Admin SDK
    const userRecord = await adminAuth.createUser({
      email: credentials.email,
      password: credentials.password,
      displayName: credentials.displayName || '',
    });

    // Store user in MongoDB (non-blocking, log error if fails)
    try {
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection(userCollectionName);

      await users.insertOne({
        uid: userRecord.uid,
        email: userRecord.email!,
        displayName: credentials.displayName || '',
        photoURL: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (mongoError: any) {
      console.error('MongoDB save failed (non-critical):', mongoError.message);
      // Continue with registration even if MongoDB fails
    }

    // Create a custom token for the user
    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    // Exchange custom token for ID token using Firebase REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to sign in after registration');
    }

    // Set JWT token in HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('token', data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.message || 'Registration failed' 
    };
  }
}
