export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}
