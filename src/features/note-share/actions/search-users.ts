'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { userCollectionName } from '@/entities/user/model/user.schema';

export async function searchUsersAction(query: string): Promise<{ 
  success: boolean; 
  users?: Array<{ uid: string; email: string; displayName: string }>; 
  error?: string 
}> {
  try {
    const user = await getSession();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!query || query.length < 2) {
      return { success: true, users: [] };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection(userCollectionName);

    // Search for users by email or displayName (case-insensitive)
    const users = await usersCollection
      .find({
        $or: [
          { email: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } }
        ],
        uid: { $ne: user.uid } // Exclude current user
      })
      .limit(5)
      .toArray();

    const formattedUsers = users.map(u => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || '',
    }));

    return { success: true, users: formattedUsers };
  } catch (error: any) {
    console.error('Search users error:', error);
    return { success: false, error: error.message || 'Failed to search users' };
  }
}
