'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { ObjectId } from 'mongodb';

export async function revokeAccessAction(noteId: string, userUid: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const user = await getSession();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection(noteCollectionName);

    // Check if note exists and user is the owner
    const note = await notesCollection.findOne({ 
      _id: new ObjectId(noteId),
      ownerId: user.uid 
    });

    if (!note) {
      return { success: false, error: 'Note not found or you do not have permission to modify sharing' };
    }

    // Remove user from sharedWith array (using uid, not ObjectId)
    await notesCollection.updateOne(
      { _id: new ObjectId(noteId) },
      { 
        $pull: { sharedWith: userUid } as any,
        $set: { updatedAt: new Date() }
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Revoke access error:', error);
    return { success: false, error: error.message || 'Failed to revoke access' };
  }
}
