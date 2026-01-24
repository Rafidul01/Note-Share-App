import { ObjectId } from 'mongodb';

export interface NoteDocument {
  _id: ObjectId;
  title: string;
  content: string;
  images: string[];
  tags: ObjectId[];
  ownerId: ObjectId;
  sharedWith: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const noteCollectionName = 'notes';
