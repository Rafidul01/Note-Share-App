export interface ShareNoteInput {
  noteId: string;
  userEmail: string;
}

export interface RevokeAccessInput {
  noteId: string;
  userId: string;
}
