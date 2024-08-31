"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BasicErrorMessage, {
  showBasicErrorMessage,
} from "../components/BasicErrorMessage";
import { signIn, signInWithGoogle } from "../lib/firebase/auth"; // Import the utility functions

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Make sure this is used inside a client-side component

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sign in the user with your custom signIn function
      const user = await signIn(email, password);

      console.log("User logged in:", user);

      router.push("/dashboard");
    } catch (error: any) {
      showBasicErrorMessage(error.message); // Use showBasicErrorMessage to display the error
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();

      console.log("User logged in with Google:", user);

      router.push("/dashboard");
    } catch (error: any) {
      showBasicErrorMessage(error.message); // Use showBasicErrorMessage to display the error
    }
  };

  return (
    <div className="bg-[#D8E8D3] text-red p-5">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-screen-lg w-full relative flex flex-col p-8 rounded-md text-black bg-white shadow-lg mt-[-100px]">
          <div className="text-5xl font-bold mb-4 text-[#1e0e4b] text-center">
            Welcome back to <span className="text-[#7747ff]">App</span>
          </div>
          <div className="text-3xl font-normal mb-6 text-center text-[#1e0e4b]">
            Log in to your account
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="block relative">
              <label
                htmlFor="email"
                className="block text-gray-600 cursor-text text-2xl leading-[140%] font-normal mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
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
            <div className="text-right">
              <Link className="text-xl text-[#7747ff]" href="#">
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-[#7747ff] w-full py-3 rounded text-white text-2xl font-normal"
            >
              Submit
            </button>
          </form>

          {/* Google Sign In */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center bg-[#4285F4] w-full py-3 rounded text-white text-2xl font-normal"
            >
              Sign in with Google
            </button>
          </div>

          <div className="text-xl text-center mt-8">
            Don’t have an account yet?{" "}
            <Link className="text-xl text-[#7747ff]" href="/signup">
              Sign up for free!
            </Link>
          </div>
        </div>
      </div>
      {/* Ensure the ToastContainer is rendered */}
      <BasicErrorMessage />
    </div>
  );
}
