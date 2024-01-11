// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { loadConfiguration } from "@/configuration";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = loadConfiguration();
const firebaseConfig = { ...config.firebase, projectId: config.gcpProjectId };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const functions = getFunctions();

/**
 * Sign user in with a Google popup.
 * @returns {Promise<UserCredential>} A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/** Sign user out of the application.
 * @returns {Promise<void>} A promise that resolves when user signs out
 */
export function signOut() {
  return auth.signOut();
}

/** Trigger a callback when user's state changes.
 * @returns {Unsubscribe} A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
