import { Tag } from '@/entities/tag/model/tag.types';
import { User } from '@/shared/types/user.types';

export interface Note {
  id: string;
  title: string;
  content: string;
  images: string[];
  tags: Tag[];
  owner: User;
  sharedWith: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
}
