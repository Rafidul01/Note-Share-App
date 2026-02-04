'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { userCollectionName } from '@/entities/user/model/user.schema';
import { tagCollectionName } from '@/entities/tag/model/tag.schema';
import { Note } from '@/entities/note/model/note.types';
import { ObjectId } from 'mongodb';

export async function getSharedNotesAction(): Promise<{ success: boolean; notes?: Note[]; error?: string }> {
  try {
    const user = await getSession();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection(noteCollectionName);
    const usersCollection = db.collection(userCollectionName);
    const tagsCollection = db.collection(tagCollectionName);

    // Find all notes where the current user is in the sharedWith array
    const notes = await notesCollection
      .find({ 
        sharedWith: { $in: [user.uid] },
        ownerId: { $ne: user.uid } // Exclude notes owned by current user
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB documents to Note objects
    const transformedNotes: Note[] = await Promise.all(
      notes.map(async (note) => {
        // Get owner info
        const owner = await usersCollection.findOne({ uid: note.ownerId });
        
        // Get shared users info
        const sharedUsers = await usersCollection
          .find({ uid: { $in: note.sharedWith || [] } })
          .toArray();

        // Get tags info
        const tagIds = (note.tags || []).map((id: any) => 
          typeof id === 'string' ? new ObjectId(id) : id
        );
        const noteTags = await tagsCollection
          .find({ _id: { $in: tagIds } })
          .toArray();

        return {
          id: note._id.toString(),
          title: note.title,
          content: note.content,
          images: note.images || [],
          tags: noteTags.map((tag) => ({
            id: tag._id.toString(),
            name: tag.name,
            color: tag.color,
            userId: tag.userId,
            createdAt: tag.createdAt,
          })),
          owner: {
            id: owner?._id.toString() || '',
            uid: owner?.uid || '',
            email: owner?.email || '',
            displayName: owner?.displayName || '',
            photoURL: owner?.photoURL || '',
            createdAt: owner?.createdAt || new Date(),
            updatedAt: owner?.updatedAt || new Date(),
          },
          sharedWith: sharedUsers.map((u) => ({
            id: u._id.toString(),
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || '',
            photoURL: u.photoURL || '',
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          })),
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        };
      })
    );

    return { success: true, notes: transformedNotes };
  } catch (error: any) {
    console.error('Get shared notes error:', error);
    return { success: false, error: error.message || 'Failed to fetch shared notes' };
  }
}
