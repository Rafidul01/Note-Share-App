import { NextResponse } from 'next/server';
import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { userCollectionName } from '@/entities/user/model/user.schema';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection(userCollectionName);

    const user = await users.findOne({ uid: session.uid });

    if (!user) {
      return NextResponse.json({
        email: session.email,
        displayName: session.displayName,
        photoURL: session.photoURL,
      });
    }

    return NextResponse.json({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
