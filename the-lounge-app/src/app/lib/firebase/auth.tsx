// src/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

// Email and Password Sign In
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Google Sign In
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Log Out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Auth State Change Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get Current User
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
