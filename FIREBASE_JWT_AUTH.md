# Firebase JWT Authentication Architecture

## Overview

This app uses **Firebase Authentication** for user management but stores the **Firebase JWT tokens in HTTP-only cookies** instead of using Firebase's default client-side session management. This provides better security and server-side control.

## Architecture

### Client Side (Browser)
1. User signs up/logs in using Firebase Auth SDK
2. Firebase returns a JWT ID token
3. Token is sent to server and stored in HTTP-only cookie
4. Client makes requests with cookie automatically included

### Server Side
1. Middleware reads JWT from cookie
2. Firebase Admin SDK verifies the JWT token
3. Protected routes require valid JWT
4. GraphQL context includes authenticated user

## Benefits

✅ **Security**: JWT stored in HTTP-only cookies (not accessible via JavaScript)
✅ **XSS Protection**: Tokens can't be stolen by malicious scripts
✅ **Server Control**: Full control over session management
✅ **Firebase Features**: Still get Firebase Auth features (email verification, password reset, etc.)
✅ **Scalability**: Stateless authentication with JWT

## Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Register/Login
       ▼
┌─────────────────────┐
│  Firebase Auth SDK  │
│  (Client-side)      │
└──────┬──────────────┘
       │
       │ 2. Returns JWT Token
       ▼
┌─────────────────────┐
│  Server Action      │
│  (Next.js)          │
└──────┬──────────────┘
       │
       │ 3. Set HTTP-only Cookie
       ▼
┌─────────────────────┐
│  Cookie Storage     │
└──────┬──────────────┘
       │
       │ 4. Subsequent Requests
       ▼
┌─────────────────────┐
│  Middleware         │
│  (Verify JWT)       │
└──────┬──────────────┘
       │
       │ 5. Firebase Admin SDK
       ▼
┌─────────────────────┐
│  Protected Route    │
└─────────────────────┘
```

## Key Files

### Client-Side Auth
- `src/shared/config/firebase.ts` - Firebase client SDK config
- `src/features/auth/actions/login.ts` - Login with Firebase, store JWT in cookie
- `src/features/auth/actions/register.ts` - Register with Firebase, store JWT in cookie
- `src/features/auth/actions/logout.ts` - Clear JWT cookie

### Server-Side Auth
- `src/shared/config/firebase-admin.ts` - Firebase Admin SDK config
- `src/shared/lib/auth.ts` - Session management (verify JWT)
- `src/middleware.ts` - Route protection with JWT verification
- `src/app/api/auth/me/route.ts` - Get current user from JWT

### Database
- `src/entities/user/model/user.schema.ts` - User data in MongoDB (synced with Firebase)

## Environment Variables

### Firebase Client (Public - Safe to expose)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase Admin (Server-side - KEEP SECRET!)
```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/noteapp
```

## Setup Instructions

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication > Email/Password
4. Enable Storage for images

### 2. Get Firebase Client Config
1. Project Settings > General
2. Scroll to "Your apps" > Web app
3. Copy config values to `.env.local`:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 3. Get Firebase Admin Config
1. Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Copy values to `.env.local`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
   ```

### 4. Setup MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/noteapp
# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noteapp
```

## Authentication Flow

### Register
```typescript
// Client calls server action
const result = await registerAction({
  email: 'user@example.com',
  password: 'password123',
  displayName: 'John Doe'
});

// Server action:
// 1. Creates user in Firebase Auth
// 2. Gets Firebase JWT token
// 3. Stores user in MongoDB
// 4. Sets JWT in HTTP-only cookie
// 5. Returns success
```

### Login
```typescript
// Client calls server action
const result = await loginAction({
  email: 'user@example.com',
  password: 'password123'
});

// Server action:
// 1. Signs in with Firebase Auth
// 2. Gets Firebase JWT token
// 3. Sets JWT in HTTP-only cookie
// 4. Returns success
```

### Protected Routes
```typescript
// Middleware automatically:
// 1. Reads JWT from cookie
// 2. Verifies with Firebase Admin SDK
// 3. Allows/denies access
// 4. Redirects to login if invalid
```

### Get Current User
```typescript
// Server-side
const user = await getSession(); // Returns { uid, email, displayName, photoURL }

// Client-side
const { user, loading } = useAuth(); // Calls /api/auth/me
```

## Security Features

1. **HTTP-Only Cookies**: JWT not accessible via JavaScript
2. **Secure Flag**: Enabled in production (HTTPS only)
3. **SameSite**: Lax mode for CSRF protection
4. **Token Verification**: Every request verified by Firebase Admin SDK
5. **Automatic Expiration**: Firebase handles token expiration
6. **Refresh Tokens**: Firebase automatically refreshes tokens

## Data Storage

### Firebase
- User authentication (email, password)
- User profile (displayName, photoURL)
- Images (Firebase Storage)

### MongoDB
- User metadata (synced from Firebase)
- Notes
- Tags
- Sharing relationships

## Why This Approach?

### vs. Firebase Client-Side Sessions
❌ Firebase default: Tokens stored in localStorage (vulnerable to XSS)
✅ Our approach: Tokens in HTTP-only cookies (XSS protected)

### vs. Pure JWT (without Firebase)
❌ Pure JWT: Need to implement password reset, email verification, etc.
✅ Our approach: Get all Firebase Auth features + secure token storage

### vs. Session-Based Auth
❌ Sessions: Need session store, not stateless
✅ Our approach: Stateless JWT, scales horizontally

## Token Lifecycle

1. **Creation**: User logs in → Firebase generates JWT
2. **Storage**: Server stores JWT in HTTP-only cookie (7 days)
3. **Usage**: Every request includes cookie automatically
4. **Verification**: Middleware verifies JWT with Firebase Admin SDK
5. **Refresh**: Firebase automatically refreshes tokens before expiration
6. **Expiration**: After 7 days, user must log in again

## Testing

```bash
# Start dev server
pnpm dev

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route (should redirect to login)
curl http://localhost:3000/notes

# Test with cookie (should work)
curl http://localhost:3000/notes \
  -H "Cookie: token=your-jwt-token"
```

## Troubleshooting

### "Unauthorized" errors
- Check Firebase Admin credentials in `.env.local`
- Verify JWT token is being set in cookie
- Check middleware is running

### "Firebase Admin SDK not initialized"
- Verify `FIREBASE_PRIVATE_KEY` is properly formatted
- Check all Firebase Admin env vars are set
- Restart dev server after changing env vars

### Token expiration issues
- Firebase tokens expire after 1 hour by default
- Firebase SDK automatically refreshes tokens
- Cookie expires after 7 days (configurable)

## Next Steps

- [ ] Implement token refresh mechanism
- [ ] Add email verification flow
- [ ] Add password reset flow
- [ ] Add social auth (Google, GitHub, etc.)
- [ ] Add 2FA support
- [ ] Add rate limiting
- [ ] Add audit logging
