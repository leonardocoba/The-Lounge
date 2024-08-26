"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import Link from "next/link";
import { auth } from "../lib/firebase"; // Firebase Auth import
import { db } from "../lib/firebase"; // Firestore import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Firestore imports
import BasicErrorMessage, {
  showBasicErrorMessage,
} from "../components/BasicErrorMessage";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showBasicErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add the new user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        friends: [], // Empty array or null for friends
        ownedRooms: [], // Empty array or null for ownedRooms
        joinedRooms: [], // Empty array or null for joinedRooms
        createdAt: serverTimestamp(), // Timestamp for creation
      });

      console.log("User signed up and added to Firestore:", user);

      // Set success to true to show the success message and link
      setSuccess(true);
    } catch (error: any) {
      showBasicErrorMessage(error.message); // Use showBasicErrorMessage instead of setting error state
    }
  };

  return (
    <div className="bg-[#D8E8D3] text-red p-5">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-screen-lg w-full relative flex flex-col p-8 rounded-md text-black bg-white shadow-lg mt-[-100px]">
          <div className="text-5xl font-bold mb-4 text-[#1e0e4b] text-center">
            Sign up for <span className="text-[#7747ff]">Free</span>
          </div>
          <div className="text-3xl font-normal mb-6 text-center text-[#1e0e4b]">
            Create your account
          </div>
          {success ? (
            <div className="text-center">
              <p className="text-green-500 text-xl mb-4">Signup successful!</p>
              <Link href="/dashboard"></Link>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="block relative">
                <label
                  htmlFor="username"
                  className="block text-gray-600 cursor-text text-2xl leading-[140%] font-normal mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded border border-gray-200 text-2xl w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-12 m-0 p-3 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                  required
                />
              </div>
              <div className="block relative">
                <label
                  htmlFor="email"
                  className="block text-gray-600 cursor-text text-2xl leading-[140%] font-normal mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border border-gray-200 text-2xl w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-12 m-0 p-3 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                  required
                />
              </div>
              <div className="block relative">
                <label
                  htmlFor="password"
                  className="block text-gray-600 cursor-text text-2xl leading-[140%] font-normal mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded border border-gray-200 text-2xl w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-12 m-0 p-3 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                  required
                />
              </div>
              <div className="block relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-600 cursor-text text-2xl leading-[140%] font-normal mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded border border-gray-200 text-2xl w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-12 m-0 p-3 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#7747ff] w-full py-3 rounded text-white text-2xl font-normal"
              >
                Sign Up
              </button>
            </form>
          )}
          <div className="text-xl text-center mt-8">
            Do you have an account already?{" "}
            <Link className="text-xl text-[#7747ff]" href="/login">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      {/* Ensure the ToastContainer is rendered */}
      <BasicErrorMessage />
    </div>
  );
}
