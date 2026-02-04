import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('token');
  
  return NextResponse.json({ success: true });
}
