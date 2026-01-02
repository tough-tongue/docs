import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { AppConfig } from "./config";

// Check if we're in a browser environment and have valid config
const isConfigValid =
  typeof window !== "undefined" &&
  AppConfig.firebase.apiKey &&
  AppConfig.firebase.apiKey !== "your_firebase_api_key";

// Initialize Firebase only if config is valid
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigValid) {
  app = getApps().length === 0 ? initializeApp(AppConfig.firebase) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
