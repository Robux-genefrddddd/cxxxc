# Firebase Setup Checklist

Follow this checklist to properly set up Firebase for CloudVault.

## Step 1: Create Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Click "Create a project" or "Add project"
- [ ] Enter project name (e.g., "CloudVault")
- [ ] Accept terms and create project
- [ ] Wait for project to be created

## Step 2: Set Up Authentication

### Enable Email/Password Authentication

- [ ] In Firebase Console, go to **Authentication** (left sidebar)
- [ ] Click on **Sign-in method** tab
- [ ] Click on **Email/Password**
- [ ] Toggle "Enable" on
- [ ] Toggle "Email link (passwordless sign-in)" OFF (we're using password auth)
- [ ] Click "Save"

## Step 3: Set Up Cloud Firestore Database

### Create Database

- [ ] Go to **Firestore Database** (left sidebar)
- [ ] Click **Create database**
- [ ] Select your region (closest to you)
- [ ] Choose **Start in production mode**
- [ ] Click **Create**

### Deploy Security Rules

- [ ] In Firestore, go to **Rules** tab
- [ ] Copy content from `firestore.rules` file in project root
- [ ] Paste into the rules editor
- [ ] Click **Publish**

## Step 4: Set Up Cloud Storage

### Enable Cloud Storage

- [ ] Go to **Cloud Storage** (left sidebar)
- [ ] Click **Get started**
- [ ] Select your region
- [ ] Click **Done** (select default bucket)

### Deploy Storage Rules

- [ ] Go to **Rules** tab
- [ ] Replace content with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload and read only their own files
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

- [ ] Click **Publish**

## Step 5: Get Firebase Configuration

### Find Your Config

- [ ] In Firebase Console, go to **Project settings** (gear icon)
- [ ] Go to **General** tab
- [ ] Scroll to "Your apps" section
- [ ] Click on the web app (or create one if needed)
- [ ] Copy the config object

### Update Project

- [ ] Open `client/lib/firebase.ts` in your project
- [ ] Replace the `firebaseConfig` object with your config
- [ ] Save the file

**Example firebase.ts:**

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

## Step 6: Verify Setup

### Test Authentication

- [ ] Run `pnpm dev`
- [ ] Go to registration page
- [ ] Create a test account
- [ ] Go to Firebase Console > Authentication
- [ ] Verify your test user appears in "Users" tab

### Test Firestore

- [ ] Try logging in with your test account
- [ ] Dashboard should appear
- [ ] Go to Firebase Console > Firestore Database
- [ ] Go to "Data" tab
- [ ] You should see a `users` collection with your user document

### Test Storage

- [ ] On Dashboard, try uploading a file
- [ ] Upload should complete
- [ ] Go to Firebase Console > Cloud Storage
- [ ] You should see `users/` folder with your files

## Step 7: Set Up Firestore Indexes (if needed)

If you get a message about needing an index:

- [ ] Click the link in the error message
- [ ] Firebase will auto-create the index
- [ ] Wait for index to be created (usually 5-10 minutes)

## Step 8: Configure CORS for Cloud Storage

If uploading files doesn't work due to CORS:

### Create CORS file

Create file `cors.json` in project root:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:8080"],
    "method": ["GET", "HEAD", "DELETE", "POST", "PUT"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

### Apply CORS

```bash
gsutil cors set cors.json gs://YOUR-BUCKET-NAME.appspot.com
```

## Troubleshooting

### "Permission denied" during upload

- [ ] Check Cloud Storage rules are deployed
- [ ] Verify user is authenticated
- [ ] Check CORS configuration
- [ ] Try in incognito window to clear cache

### "Permission denied" on Firestore

- [ ] Check Firestore rules are deployed
- [ ] Verify `users/{userId}` path matches your user ID
- [ ] Check Firestore Database > Rules shows your rules

### Firebase module not found

- [ ] Run `pnpm install` to install dependencies
- [ ] Delete `node_modules` and run `pnpm install` again
- [ ] Clear browser cache

### Can't create account

- [ ] Verify Authentication is enabled
- [ ] Check password is at least 6 characters
- [ ] Look for error in browser console

### 404 on login attempt

- [ ] Check user exists in Firebase Console > Authentication
- [ ] Try resetting password first
- [ ] Try creating a new account

## Security Configuration Checklist

### Authentication Security

- [ ] Email/Password enabled
- [ ] Disable anonymous authentication (if enabled)
- [ ] Set password requirements (minimum length)
- [ ] Consider enabling reCAPTCHA (in Production)

### Firestore Security

- [ ] Rules deployed and tested
- [ ] Rules deny all by default
- [ ] Only allow authenticated users
- [ ] Verify user isolation working

### Cloud Storage Security

- [ ] Rules deployed and tested
- [ ] Only authenticated users can upload
- [ ] Users can only access their own files
- [ ] Files have appropriate retention policy

### Additional Security

- [ ] Enable Firestore backups (in settings)
- [ ] Set up Activity logs monitoring
- [ ] Review and enable app signatures (Play Store)
- [ ] Consider enabling reCAPTCHA on auth pages

## Production Deployment Checklist

Before deploying to production:

- [ ] Update Firebase config for production project
- [ ] Test all features in production environment
- [ ] Set up email provider for password reset
- [ ] Configure custom domain (optional)
- [ ] Enable backup and recovery procedures
- [ ] Set up monitoring and alerts
- [ ] Review billing and quotas
- [ ] Enable API access restrictions
- [ ] Set up WAF rules (if using Cloudflare)
- [ ] Configure CDN for static assets

## Next Steps

Once Firebase is set up:

1. Run `pnpm dev` to start development
2. Create test account and test all features
3. Upload test files and verify they appear in Firestore
4. Test file sharing by creating share link
5. Share link with someone (don't need account to download)
6. Test password reset and account settings
7. Deploy to Netlify/Vercel when ready

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Console Help](https://firebase.google.com/support)

---

**Status**: Follow these steps in order. Each step builds on the previous one.
