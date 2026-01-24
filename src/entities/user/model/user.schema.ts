import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id: ObjectId;
  uid: string; // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userCollectionName = 'users';
