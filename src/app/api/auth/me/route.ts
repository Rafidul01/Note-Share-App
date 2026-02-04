import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/shared/config/firebase-admin';

// Force dynamic rendering - don't try to generate this at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Get user details
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Auth error:', error);
    
    // If token is expired or invalid, clear the cookie
    if (error?.errorInfo?.code === 'auth/id-token-expired' || 
        error?.errorInfo?.code === 'auth/argument-error') {
       const cookieStore = cookies();
      cookieStore.delete('token');
    }
    
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
