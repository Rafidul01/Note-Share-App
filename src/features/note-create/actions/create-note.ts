'use server';

import { CreateNoteInput } from '@/entities/note/model/note.types';
import { getSession } from '@/shared/lib/auth';
import { apolloClient } from '@/shared/api/apollo-client';
import { CREATE_NOTE } from '@/shared/api/graphql-mutations';

export async function createNoteAction(input: CreateNoteInput) {
  try {
    const session = await getSession();
    
    if (!session) {
      return { success: false, error: 'Unauthorized. Please login.' };
    }

    const { data } = await apolloClient.mutate({
      mutation: CREATE_NOTE,
      variables: {
        title: input.title,
        content: input.content,
      },
    });

    if (data?.createNote) {
      return { 
        success: true, 
        noteId: data.createNote.id 
      };
    }

    return { success: false, error: 'Failed to create note' };
  } catch (error) {
    console.error('Create note error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    };
  }
}
