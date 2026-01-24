import { ObjectId } from 'mongodb';

export interface TagDocument {
  _id: ObjectId;
  name: string;
  color: string;
  userId: ObjectId;
  createdAt: Date;
}

export const tagCollectionName = 'tags';
