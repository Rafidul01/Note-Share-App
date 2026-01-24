'use server';

import { cookies } from 'next/headers';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import clientPromise from '@/shared/lib/mongodb';
import { userCollectionName } from '@/entities/user/model/user.schema';
import { RegisterCredentials } from '../types/auth.types';

export async function registerAction(credentials: RegisterCredentials) {
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (credentials.displayName) {
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });
    }

    // Get Firebase ID token (JWT)
    const idToken = await userCredential.user.getIdToken();

    // Store user in MongoDB
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection(userCollectionName);

    await users.insertOne({
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: credentials.displayName || '',
      photoURL: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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
