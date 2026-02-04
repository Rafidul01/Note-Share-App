'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { ObjectId } from 'mongodb';

export async function deleteNoteAction(noteId: string): Promise<{ 
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
      return { success: false, error: 'Note not found or you do not have permission to delete it' };
    }

    // Delete the note
    await notesCollection.deleteOne({ _id: new ObjectId(noteId) });

    return { success: true };
  } catch (error: any) {
    console.error('Delete note error:', error);
    return { success: false, error: error.message || 'Failed to delete note' };
  }
}
