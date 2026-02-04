import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { getSession, FirebaseUser } from '@/shared/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    displayName: String
    photoURL: String
    createdAt: String!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    images: [String!]!
    tags: [Tag!]!
    owner: User!
    sharedWith: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type Tag {
    id: ID!
    name: String!
    color: String!
    userId: ID!
    createdAt: String!
  }

  type Query {
    me: User
    notes: [Note!]!
    note(id: ID!): Note
    sharedNotes: [Note!]!
    tags: [Tag!]!
  }

  type Mutation {
    createNote(title: String!, content: String!): Note!
    updateNote(id: ID!, title: String, content: String): Note!
    deleteNote(id: ID!): Boolean!
    createTag(name: String!, color: String): Tag!
    deleteTag(id: ID!): Boolean!
    shareNote(noteId: ID!, userEmail: String!): Note!
    revokeAccess(noteId: ID!, userId: ID!): Note!
  }
`;

interface Context {
  user: FirebaseUser | null;
}

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      return {
        id: context.user.uid,
        email: context.user.email,
        displayName: context.user.displayName,
        photoURL: context.user.photoURL,
      };
    },
    notes: () => [],
    note: () => null,
    sharedNotes: () => [],
    tags: () => [],
  },
  Mutation: {
    createNote: () => null,
    updateNote: () => null,
    deleteNote: () => false,
    createTag: () => null,
    deleteTag: () => false,
    shareNote: () => null,
    revokeAccess: () => null,
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const user = await getSession();
    return { user };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
