import { apolloClient } from '@/shared/api/apollo-client';
import { GET_NOTES, GET_NOTE } from '@/shared/api/graphql-queries';

export async function getNotes() {
  const { data } = await apolloClient.query({
    query: GET_NOTES,
  });
  return data.notes;
}

export async function getNote(id: string) {
  const { data } = await apolloClient.query({
    query: GET_NOTE,
    variables: { id },
  });
  return data.note;
}
