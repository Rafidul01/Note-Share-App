'use server';

import { getSession } from '@/shared/lib/auth';
import clientPromise from '@/shared/lib/mongodb';
import { noteCollectionName } from '@/entities/note/model/note.schema';
import { userCollectionName } from '@/entities/user/model/user.schema';
import { tagCollectionName } from '@/entities/tag/model/tag.schema';
import { Note } from '@/entities/note/model/note.types';
import { ObjectId } from 'mongodb';

interface CreateNoteInput {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}

export async function createNoteAction(input: CreateNoteInput): Promise<{ 
  success: boolean; 
  note?: Note; 
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
    const tagsCollection = db.collection(tagCollectionName);

    // Process tags - create or find existing tags
    const tagIds: ObjectId[] = [];
    const tagObjects = [];

    if (input.tags && input.tags.length > 0) {
      for (const tagName of input.tags) {
        // Check if tag already exists for this user
        let existingTag = await tagsCollection.findOne({
          name: tagName,
          userId: user.uid,
        });

        if (existingTag) {
          tagIds.push(existingTag._id);
          tagObjects.push({
            id: existingTag._id.toString(),
            name: existingTag.name,
            color: existingTag.color,
            userId: existingTag.userId,
            createdAt: existingTag.createdAt,
          });
        } else {
          // Create new tag with random color
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
          tagObjects.push({
            id: tagResult.insertedId.toString(),
            name: newTag.name,
            color: newTag.color,
            userId: newTag.userId,
            createdAt: newTag.createdAt,
          });
        }
      }
    }

    // Create the note document
    const now = new Date();
    const noteDoc = {
      title: input.title,
      content: input.content,
      images: input.images || [],
      tags: tagIds,
      ownerId: user.uid,
      sharedWith: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await notesCollection.insertOne(noteDoc);

    // Get owner info
    const owner = await usersCollection.findOne({ uid: user.uid });

    // Transform to Note type
    const note: Note = {
      id: result.insertedId.toString(),
      title: noteDoc.title,
      content: noteDoc.content,
      images: noteDoc.images,
      tags: tagObjects,
      owner: {
        id: owner?._id.toString() || '',
        uid: owner?.uid || user.uid,
        email: owner?.email || user.email || '',
        displayName: owner?.displayName || user.displayName || '',
        photoURL: owner?.photoURL || user.photoURL || '',
        createdAt: owner?.createdAt || now,
        updatedAt: owner?.updatedAt || now,
      },
      sharedWith: [],
      createdAt: noteDoc.createdAt,
      updatedAt: noteDoc.updatedAt,
    };

    return { success: true, note };
  } catch (error: any) {
    console.error('Create note error:', error);
    return { success: false, error: error.message || 'Failed to create note' };
  }
}
