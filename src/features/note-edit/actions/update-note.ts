'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { ObjectId } from 'mongodb';

interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  images?: string[];
}

export async function updateNoteAction(input: UpdateNoteInput): Promise<{ 
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
      _id: new ObjectId(input.id),
      ownerId: user.uid 
    });

    if (!note) {
      return { success: false, error: 'Note not found or you do not have permission to edit it' };
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.content !== undefined) {
      updateData.content = input.content;
    }

    if (input.images !== undefined) {
      updateData.images = input.images;
    }

    // Update the note
    await notesCollection.updateOne(
      { _id: new ObjectId(input.id) },
      { $set: updateData }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Update note error:', error);
    return { success: false, error: error.message || 'Failed to update note' };
  }
}
