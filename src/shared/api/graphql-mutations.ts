import { gql } from '@apollo/client';

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $content: String!) {
    createNote(title: $title, content: $content) {
      id
      title
      content
      createdAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $title: String, $content: String) {
    updateNote(id: $id, title: $title, content: $content) {
      id
      title
      content
      updatedAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($name: String!, $color: String) {
    createTag(name: $name, color: $color) {
      id
      name
      color
    }
  }
`;

export const SHARE_NOTE = gql`
  mutation ShareNote($noteId: ID!, $userEmail: String!) {
    shareNote(noteId: $noteId, userEmail: $userEmail) {
      id
      sharedWith {
        id
        email
      }
    }
  }
`;
