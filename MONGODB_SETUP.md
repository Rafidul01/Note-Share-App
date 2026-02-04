# MongoDB Setup Guide

## The Issue
Registration was failing because MongoDB wasn't running locally. The error "connect ECONNREFUSED ::1:27017" means the app couldn't connect to MongoDB on port 27017.

## Quick Fix Applied
✅ Registration now works even without MongoDB running
- User is created in Firebase (authentication)
- MongoDB save is non-blocking (won't stop registration if it fails)

## To Start MongoDB (Recommended)

### Option 1: Using Homebrew (macOS)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

### Option 2: Using Docker
```bash
# Run MongoDB in a container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop MongoDB
docker stop mongodb

# Start MongoDB again
docker start mongodb
```

### Option 3: Use MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noteapp
   ```

## Why You Need MongoDB
While authentication works with Firebase only, these features require MongoDB:
- Storing user profiles
- Notes data
- Tags
- Sharing permissions
- Any GraphQL queries

## Current Status
- ✅ Registration works (creates Firebase user)
- ✅ Login works (Firebase authentication)
- ⚠️ Notes and other features need MongoDB running

## Test Registration Now
Try registering again - it should work! But start MongoDB for full app functionality.
