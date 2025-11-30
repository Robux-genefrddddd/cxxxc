# CloudVault - Secure Cloud Storage Setup Guide

This is a complete cloud storage application built with React, Firebase, and Node.js.

## Features

- User registration and authentication
- Secure file upload and storage
- File download and deletion
- File sharing with expirable links
- Account settings with password management
- User token management
- Professional, responsive design

## Prerequisites

- Node.js 16+ and pnpm
- Firebase account with a project created
- Modern web browser

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Cloud Firestore** (Database)
   - **Cloud Storage** (File storage)

### 3. Configure Firebase

The Firebase configuration is already in `client/lib/firebase.ts`. The config provided uses a sample project. To use your own Firebase project:

1. Get your Firebase config from project settings
2. Update `client/lib/firebase.ts` with your Firebase credentials

### 4. Set Up Firestore Security Rules

1. In Firebase Console, go to Firestore Database
2. Go to the Rules tab
3. Copy the contents of `firestore.rules` and paste it
4. Publish the rules

### 5. Set Up Cloud Storage Rules

1. In Firebase Console, go to Cloud Storage
2. Go to the Rules tab
3. Add these rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload and read their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Running the Application

### Development

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
client/
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   ├── Dashboard.tsx       # Main cloud storage dashboard
│   ├── Settings.tsx        # Account settings
│   ├── ResetPassword.tsx   # Password reset
│   └── SharedFile.tsx      # Public shared file access
├── components/
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   ├── Header.tsx          # App header/navigation
│   ├── FileCard.tsx        # File card component
│   └── ShareModal.tsx      # Share link modal
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── authContext.tsx     # Authentication context
│   └── fileUtils.ts        # File operations utilities
├── global.css              # Global styles with professional theme
└── App.tsx                 # Main app component and routing

firestore.rules            # Firestore security rules
SETUP.md                   # This file
```

## Security Features

✅ **Authentication**: Firebase Authentication with email/password
✅ **Data Encryption**: Files stored in Cloud Storage with security rules
✅ **User Isolation**: Strict Firestore rules ensure users can only access their own data
✅ **Secure Sharing**: Share links with tokens and expiration
✅ **Password Reset**: Secure password reset via email
✅ **No SQL Injection**: Firestore (NoSQL) prevents SQL injection
✅ **XSS Protection**: React's built-in XSS protection
✅ **CSRF Protection**: Firebase handles CSRF protection
✅ **Rate Limiting**: Configure in Firebase Authentication settings

## Usage

### Creating an Account
1. Click "Sign Up" on the landing page
2. Enter email and password
3. Account is created and user is logged in

### Uploading Files
1. Click the upload area on Dashboard
2. Select one or multiple files
3. Files are uploaded to secure storage

### Sharing Files
1. Click the three-dot menu on a file
2. Select "Share"
3. Choose link expiry time
4. Copy the share link
5. Share with others (no login required to access)

### Account Settings
1. Click your profile in the header
2. Select "Settings"
3. Change password or regenerate share token

### Downloading Files
1. Click the three-dot menu on a file
2. Select "Download"
3. File downloads to your device

### Deleting Files
1. Click the three-dot menu on a file
2. Select "Delete"
3. Confirm deletion

## Environment Variables

The app uses Firebase configuration embedded in `client/lib/firebase.ts`. No additional environment variables are required for basic functionality.

## Troubleshooting

### "Permission denied" errors when uploading
- Check that Cloud Storage rules are properly configured
- Verify user is authenticated

### Files don't appear after upload
- Check browser console for errors
- Verify Firestore rules allow read access
- Check network tab for failed requests

### Can't login
- Verify Firebase Authentication is enabled
- Check user exists in Firebase Console
- Try resetting password

## Deployment

### Deploy to Netlify (Recommended)

```bash
# Build first
pnpm build

# Deploy using Netlify CLI
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Build first
pnpm build

# Deploy using Vercel CLI
vercel --prod
```

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is open source and available under the MIT License.

---

**For production use**, consider:
- Enabling two-factor authentication in Firebase
- Setting up backup and recovery procedures
- Implementing GDPR compliance features
- Adding file versioning/trash features
- Implementing quotas and billing
