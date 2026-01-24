import { apolloClient } from '@/shared/api/apollo-client';
import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from '@/shared/api/graphql-mutations';

export async function createNote(title: string, content: string) {
  const { data } = await apolloClient.mutate({
    mutation: CREATE_NOTE,
    variables: { title, content },
  });
  return data.createNote;
}

export async function updateNote(id: string, title?: string, content?: string) {
  const { data } = await apolloClient.mutate({
    mutation: UPDATE_NOTE,
    variables: { id, title, content },
  });
  return data.updateNote;
}

export async function deleteNote(id: string) {
  const { data } = await apolloClient.mutate({
    mutation: DELETE_NOTE,
    variables: { id },
  });
  return data.deleteNote;
}
