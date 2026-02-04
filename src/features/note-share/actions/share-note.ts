'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { userCollectionName } from '@/entities/user/model/user.schema';
import { ObjectId } from 'mongodb';

export async function shareNoteAction(noteId: string, userEmail: string): Promise<{ 
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
    const usersCollection = db.collection(userCollectionName);

    // Check if note exists and user is the owner
    const note = await notesCollection.findOne({ 
      _id: new ObjectId(noteId),
      ownerId: user.uid 
    });

    if (!note) {
      return { success: false, error: 'Note not found or you do not have permission to share it' };
    }

    // Find the user to share with by email
    const targetUser = await usersCollection.findOne({ email: userEmail });

    if (!targetUser) {
      return { success: false, error: 'User not found with that email address' };
    }

    // Check if already shared with this user
    if (note.sharedWith && note.sharedWith.includes(targetUser.uid)) {
      return { success: false, error: 'Note is already shared with this user' };
    }

    // Check if trying to share with self
    if (targetUser.uid === user.uid) {
      return { success: false, error: 'You cannot share a note with yourself' };
    }

    // Add user to sharedWith array
    await notesCollection.updateOne(
      { _id: new ObjectId(noteId) },
      { 
        $addToSet: { sharedWith: targetUser.uid },
        $set: { updatedAt: new Date() }
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Share note error:', error);
    return { success: false, error: error.message || 'Failed to share note' };
  }
}
