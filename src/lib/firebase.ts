import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDSw8YwIANv-g53gktMj_UrJE-1yZ32IuE",
  authDomain: "labour-lens-23le0.firebaseapp.com",
  projectId: "labour-lens-23le0",
  storageBucket: "labour-lens-23le0.firebasestorage.app",
  messagingSenderId: "429125590740",
  appId: "1:429125590740:web:c47f541e99c5a0af672541"
};
// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, app };

// This file sets up Firebase. For a real application:
// 1. Ensure Firebase SDK is installed: npm install firebase
// 2. Create a Firebase project at https://console.firebase.google.com/
// 3. Get your Firebase config and add it to environment variables (e.g., .env or .env.local)
//    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
//    ...and so on for all config keys.
// 4. Enable Firestore (Database -> Cloud Firestore -> Create database -> Start in test mode for dev, secure later)
//    and Storage (Storage -> Get started) in your Firebase project console.
// 5. Set up Firestore security rules (e.g., allow read/write for authenticated users or specific paths).
//    Default test rules:
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /{document=**} {
//          allow read, write: if request.time < timestamp.date(2024, 12, 31); // Or your preferred test duration
//        }
//      }
//    }
// 6. Set up Storage security rules.
//    Default test rules:
//    rules_version = '2';
//    service firebase.storage {
//      match /b/{bucket}/o {
//        match /{allPaths=**} {
//          allow read, write: if request.time < timestamp.date(2024, 12, 31); // Or your preferred test duration
//        }
//      }
//    }
