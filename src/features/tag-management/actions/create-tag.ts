'use server';

import { CreateTagInput } from '@/entities/tag/model/tag.types';

export async function createTagAction(input: CreateTagInput) {
  // TODO: Implement GraphQL mutation
  return { success: true, tagId: 'temp-id' };
}
