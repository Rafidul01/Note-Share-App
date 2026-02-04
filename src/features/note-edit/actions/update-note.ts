'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { tagCollectionName } from '@/entities/tag/model/tag.schema';
import { ObjectId } from 'mongodb';

interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
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
    const tagsCollection = db.collection(tagCollectionName);

    // Check if note exists and user is the owner
    const note = await notesCollection.findOne({ 
      _id: new ObjectId(input.id),
      ownerId: user.uid 
    });

    console.log('Update note - Looking for:', { id: input.id, ownerId: user.uid });
    console.log('Update note - Found:', note ? 'Yes' : 'No');

    if (!note) {
      // Try to find the note without owner check to see if it exists
      const noteExists = await notesCollection.findOne({ _id: new ObjectId(input.id) });
      console.log('Note exists without owner check:', noteExists);
      
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

    // Handle tags if provided
    if (input.tags !== undefined) {
      const tagIds: ObjectId[] = [];

      for (const tagName of input.tags) {
        // Check if tag already exists for this user
        let existingTag = await tagsCollection.findOne({
          name: tagName,
          userId: user.uid,
        });

        if (existingTag) {
          tagIds.push(existingTag._id);
        } else {
          // Create new tag
          const colors = ['#BFDBFE', '#BBF7D0'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          const newTag = {
            name: tagName,
            color: randomColor,
            userId: user.uid,
            createdAt: new Date(),
          };

          const tagResult = await tagsCollection.insertOne(newTag);
          tagIds.push(tagResult.insertedId);
        }
      }

      updateData.tags = tagIds;
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
