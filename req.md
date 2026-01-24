# Note Taking Application - Implementation Plan

## Tech Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Authentication**: Firebase Auth
- **Database**: MongoDB
- **API Layer**: GraphQL (Apollo Server/Client)
- **Package Manager**: pnpm
- **Architecture**: Feature-Sliced Design (FSD)

## Core Features
1. Authentication (Firebase Auth)
2. CRUD Operations for Notes
3. Tags/Categories
4. Share Notes with Other Users
5. Image Upload in Notes

---

## Project Structure (FSD Architecture)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── shared/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   └── graphql/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── shared/                       # Shared layer (reusable across features)
│   ├── api/
│   │   ├── apollo-client.ts
│   │   ├── graphql-queries.ts
│   │   └── graphql-mutations.ts
│   ├── config/
│   │   ├── firebase.ts
│   │   └── constants.ts
│   ├── lib/
│   │   ├── mongodb.ts
│   │   └── utils.ts
│   ├── ui/                       # Shared UI components
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   └── button.types.ts
│   │   ├── input/
│   │   │   ├── input.tsx
│   │   │   └── input.types.ts
│   │   ├── modal/
│   │   ├── loader/
│   │   └── toast/
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-toast.ts
│   └── types/
│       ├── user.types.ts
│       └── common.types.ts
│
├── entities/                     # Business entities
│   ├── note/
│   │   ├── model/
│   │   │   ├── note.schema.ts    # MongoDB schema
│   │   │   └── note.types.ts
│   │   ├── api/
│   │   │   ├── note.queries.ts
│   │   │   └── note.mutations.ts
│   │   └── ui/
│   │       ├── note-card/
│   │       │   ├── note-card.tsx
│   │       │   └── note-card.types.ts
│   │       └── note-list/
│   │           └── note-list.tsx
│   ├── tag/
│   │   ├── model/
│   │   │   ├── tag.schema.ts
│   │   │   └── tag.types.ts
│   │   ├── api/
│   │   │   └── tag.queries.ts
│   │   └── ui/
│   │       └── tag-chip/
│   │           └── tag-chip.tsx
│   └── user/
│       ├── model/
│       │   ├── user.schema.ts
│       │   └── user.types.ts
│       └── api/
│           └── user.queries.ts
│
├── features/                     # User interactions/features
│   ├── auth/
│   │   ├── actions/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── logout.ts
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── auth-provider.tsx
│   │   ├── hooks/
│   │   │   └── use-auth-state.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── note-create/
│   │   ├── actions/
│   │   │   └── create-note.ts
│   │   ├── components/
│   │   │   ├── note-editor.tsx
│   │   │   └── image-uploader.tsx
│   │   └── types/
│   │       └── note-create.types.ts
│   ├── note-edit/
│   │   ├── actions/
│   │   │   └── update-note.ts
│   │   ├── components/
│   │   │   └── note-edit-form.tsx
│   │   └── types/
│   │       └── note-edit.types.ts
│   ├── note-delete/
│   │   ├── actions/
│   │   │   └── delete-note.ts
│   │   └── components/
│   │       └── delete-confirmation.tsx
│   ├── note-share/
│   │   ├── actions/
│   │   │   ├── share-note.ts
│   │   │   └── revoke-access.ts
│   │   ├── components/
│   │   │   ├── share-modal.tsx
│   │   │   └── shared-users-list.tsx
│   │   └── types/
│   │       └── share.types.ts
│   ├── tag-management/
│   │   ├── actions/
│   │   │   ├── create-tag.ts
│   │   │   └── delete-tag.ts
│   │   ├── components/
│   │   │   ├── tag-selector.tsx
│   │   │   └── tag-filter.tsx
│   │   └── types/
│   │       └── tag.types.ts
│   └── image-upload/
│       ├── actions/
│       │   └── upload-image.ts
│       ├── components/
│       │   ├── image-dropzone.tsx
│       │   └── image-preview.tsx
│       └── types/
│           └── image.types.ts
│
└── widgets/                      # Composite blocks (page sections)
    ├── header/
    │   └── header.tsx
    ├── sidebar/
    │   └── sidebar.tsx
    ├── note-dashboard/
    │   └── note-dashboard.tsx
    └── shared-notes-view/
        └── shared-notes-view.tsx
```

---

## Implementation Phases

### Phase 1: Project Setup & Configuration (Week 1)
**Tasks:**
1. Initialize Next.js project with TypeScript
2. Setup pnpm workspace
3. Configure Firebase (Auth + Storage for images)
4. Setup MongoDB connection
5. Configure Apollo Server & Client for GraphQL
6. Setup ESLint, Prettier, and TypeScript configs
7. Create base folder structure (FSD)

**Deliverables:**
- Working dev environment
- Firebase config
- MongoDB connection
- GraphQL server running

---

### Phase 2: Authentication (Week 1-2)
**Tasks:**
1. Implement Firebase Auth integration
2. Create auth context/provider
3. Build login/register UI
4. Implement protected routes middleware
5. Create user schema in MongoDB
6. GraphQL mutations for user operations

**Files to Create:**
- `src/shared/config/firebase.ts`
- `src/features/auth/actions/login.ts`
- `src/features/auth/actions/register.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/register-form.tsx`
- `src/features/auth/components/auth-provider.tsx`
- `src/entities/user/model/user.schema.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

**GraphQL Schema:**
```graphql
type User {
  id: ID!
  email: String!
  displayName: String
  photoURL: String
  createdAt: DateTime!
}

type Mutation {
  createUser(email: String!, uid: String!): User
}
```

---

### Phase 3: Core Note CRUD (Week 2-3)
**Tasks:**
1. Create Note schema in MongoDB
2. Build GraphQL schema for notes
3. Implement CRUD mutations and queries
4. Create note editor component (rich text)
5. Build note list/grid view
6. Implement note detail view

**Files to Create:**
- `src/entities/note/model/note.schema.ts`
- `src/entities/note/api/note.queries.ts`
- `src/entities/note/api/note.mutations.ts`
- `src/features/note-create/components/note-editor.tsx`
- `src/features/note-edit/components/note-edit-form.tsx`
- `src/entities/note/ui/note-card/note-card.tsx`
- `src/app/(dashboard)/notes/page.tsx`
- `src/app/(dashboard)/notes/[id]/page.tsx`
- `src/app/(dashboard)/notes/new/page.tsx`

**GraphQL Schema:**
```graphql
type Note {
  id: ID!
  title: String!
  content: String!
  images: [String]
  tags: [Tag]
  owner: User!
  sharedWith: [User]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  notes: [Note]
  note(id: ID!): Note
  sharedNotes: [Note]
}

type Mutation {
  createNote(title: String!, content: String!): Note
  updateNote(id: ID!, title: String, content: String): Note
  deleteNote(id: ID!): Boolean
}
```

---

### Phase 4: Tags System (Week 3)
**Tasks:**
1. Create Tag schema
2. Implement tag CRUD operations
3. Build tag selector component
4. Add tag filtering to notes list
5. Create tag management UI

**Files to Create:**
- `src/entities/tag/model/tag.schema.ts`
- `src/features/tag-management/actions/create-tag.ts`
- `src/features/tag-management/components/tag-selector.tsx`
- `src/features/tag-management/components/tag-filter.tsx`
- `src/entities/tag/ui/tag-chip/tag-chip.tsx`

**GraphQL Schema:**
```graphql
type Tag {
  id: ID!
  name: String!
  color: String
  userId: ID!
}

type Mutation {
  createTag(name: String!, color: String): Tag
  deleteTag(id: ID!): Boolean
  addTagToNote(noteId: ID!, tagId: ID!): Note
  removeTagFromNote(noteId: ID!, tagId: ID!): Note
}
```

---

### Phase 5: Note Sharing (Week 4)
**Tasks:**
1. Implement share functionality in Note schema
2. Create GraphQL mutations for sharing
3. Build share modal UI
4. Implement access control logic
5. Create shared notes view
6. Add email notifications (optional)

**Files to Create:**
- `src/features/note-share/actions/share-note.ts`
- `src/features/note-share/components/share-modal.tsx`
- `src/features/note-share/components/shared-users-list.tsx`
- `src/app/(dashboard)/shared/page.tsx`
- `src/widgets/shared-notes-view/shared-notes-view.tsx`

**GraphQL Schema:**
```graphql
type Mutation {
  shareNote(noteId: ID!, userEmail: String!): Note
  revokeAccess(noteId: ID!, userId: ID!): Note
}
```

---

### Phase 6: Image Upload (Week 4)
**Tasks:**
1. Setup Firebase Storage
2. Create image upload utility
3. Build image dropzone component
4. Implement image preview
5. Add image deletion
6. Integrate with note editor

**Files to Create:**
- `src/features/image-upload/actions/upload-image.ts`
- `src/features/image-upload/components/image-dropzone.tsx`
- `src/features/image-upload/components/image-preview.tsx`
- `src/features/note-create/components/image-uploader.tsx`

**GraphQL Schema:**
```graphql
type Mutation {
  addImageToNote(noteId: ID!, imageUrl: String!): Note
  removeImageFromNote(noteId: ID!, imageUrl: String!): Note
}
```

---

## Database Schemas

### MongoDB Collections

#### Users Collection
```typescript
{
  _id: ObjectId,
  uid: string,              // Firebase UID
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notes Collection
```typescript
{
  _id: ObjectId,
  title: string,
  content: string,          // Rich text/HTML
  images: string[],         // Firebase Storage URLs
  tags: ObjectId[],         // Reference to tags
  ownerId: ObjectId,        // Reference to user
  sharedWith: ObjectId[],   // Array of user IDs
  createdAt: Date,
  updatedAt: Date
}
```

#### Tags Collection
```typescript
{
  _id: ObjectId,
  name: string,
  color: string,
  userId: ObjectId,         // Reference to user
  createdAt: Date
}
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "firebase": "^10.0.0",
    "mongodb": "^6.0.0",
    "@apollo/server": "^4.0.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.300.0",
    "react-dropzone": "^14.2.0",
    "slate": "^0.100.0",
    "slate-react": "^0.100.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# MongoDB
MONGODB_URI=
MONGODB_DB=

# GraphQL
GRAPHQL_ENDPOINT=/api/graphql
```

---

## Best Practices & Recommendations

### 1. FSD Architecture Guidelines
- **Shared Layer**: Only reusable, generic code
- **Entities Layer**: Business logic, no UI interactions
- **Features Layer**: User interactions, can use entities
- **Widgets Layer**: Composite blocks, can use features and entities
- **App Layer**: Routes, layouts, providers

### 2. GraphQL Best Practices
- Use DataLoader for batching and caching
- Implement proper error handling
- Add authentication middleware
- Use GraphQL Code Generator for type safety

### 3. Security
- Validate Firebase tokens on server
- Implement rate limiting
- Sanitize user inputs
- Use MongoDB indexes for performance
- Implement proper CORS policies

### 4. Performance
- Implement pagination for notes list
- Use Next.js Image component for images
- Lazy load components
- Implement optimistic UI updates
- Cache GraphQL queries

### 5. Testing Strategy
- Unit tests for actions and utilities
- Integration tests for GraphQL resolvers
- E2E tests for critical user flows
- Use Jest + React Testing Library

---

## Additional Features (Future Enhancements)

1. **Rich Text Editor**: Implement with Slate.js or TipTap
2. **Real-time Collaboration**: Use WebSockets or Firebase Realtime DB
3. **Search**: Implement full-text search with MongoDB Atlas Search
4. **Export**: PDF/Markdown export functionality
5. **Dark Mode**: Theme switching
6. **Mobile App**: React Native version
7. **Offline Support**: PWA with service workers
8. **Version History**: Track note changes
9. **Folders/Notebooks**: Organize notes in folders
10. **Templates**: Pre-built note templates

---

## Timeline Summary

- **Week 1**: Setup + Auth
- **Week 2-3**: Core CRUD + Tags
- **Week 4**: Sharing + Images
- **Week 5**: Testing + Polish
- **Week 6**: Deployment + Documentation

**Total Estimated Time**: 6 weeks for MVP

---

## Next Steps

1. Review and approve this plan
2. Setup development environment
3. Create Firebase project
4. Setup MongoDB Atlas cluster
5. Initialize Next.js project with FSD structure
6. Begin Phase 1 implementation
