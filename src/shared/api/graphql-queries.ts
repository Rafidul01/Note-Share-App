import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      title
      content
      images
      createdAt
      updatedAt
      tags {
        id
        name
        color
      }
    }
  }
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
      id
      title
      content
      images
      createdAt
      updatedAt
      tags {
        id
        name
        color
      }
      sharedWith {
        id
        email
        displayName
      }
    }
  }
`;

export const GET_SHARED_NOTES = gql`
  query GetSharedNotes {
    sharedNotes {
      id
      title
      content
      createdAt
      owner {
        email
        displayName
      }
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      color
    }
  }
`;
