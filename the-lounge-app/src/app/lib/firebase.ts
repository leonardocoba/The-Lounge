import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Auth

const firebaseConfig = {
  apiKey: "AIzaSyA8p5IC9dqAg16zuWQP_01r6hTiyS7B7Uc",
  authDomain: "the-lounge-68f0d.firebaseapp.com",
  projectId: "the-lounge-68f0d",
  storageBucket: "the-lounge-68f0d.appspot.com",
  messagingSenderId: "758162092212",
  appId: "1:758162092212:web:3379a579a50f134ddda7e1",
  measurementId: "G-TNXPWM7343",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Analytics if window exists
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, analytics };
