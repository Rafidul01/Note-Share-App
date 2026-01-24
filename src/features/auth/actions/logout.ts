'use server';

import { signOut } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';

export async function logoutAction() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
