import { apolloClient } from '@/shared/api/apollo-client';
import { GET_TAGS } from '@/shared/api/graphql-queries';

export async function getTags() {
  const { data } = await apolloClient.query({
    query: GET_TAGS,
  });
  return data.tags;
}
