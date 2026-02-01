'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('token');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
