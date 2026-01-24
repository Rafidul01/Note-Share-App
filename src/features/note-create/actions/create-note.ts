'use server';

import { CreateNoteInput } from '@/entities/note/model/note.types';

export async function createNoteAction(input: CreateNoteInput) {
  // TODO: Implement GraphQL mutation
  return { success: true, noteId: 'temp-id' };
}
