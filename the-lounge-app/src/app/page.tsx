"use client";

import Layout from "./layout";
import "./globals.css";
import Navbar from "./components/NavBar";
import Image from "next/image";
import PreviewImage from "./assets/images/AppPreview.png";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth(); // Get the current user from the Auth context

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F5DC] text-white p-5">
        <Navbar />
        <div className="h-[200vh]">
          {/* Preview Section */}
          <div className="flex items-center justify-between bg-[#1B1F3B] text-white rounded-3xl p-8 mt-10 shadow-lg h-[75vh]">
            {/* Text on the left side */}
            <div className="w-1/2 flex flex-col justify-center items-center text-center">
              <h1 className="text-8xl font-bold">Be Home, Far From Home</h1>
              <p className="mt-4 text-3xl pb-10">
                Share. Create. Stream. Be Together.
              </p>
              <Link href={user ? "/dashboard" : "/login"}>
                <button className="bg-[#AEE1D4] text-[#1B1F3B] py-3 px-6 rounded-full font-semibold text-2xl">
                  {user ? "Enter the Lounge" : "Get Started"}
                </button>
              </Link>
            </div>

            {/* Preview Image on the right side */}
            <div className="w-1/2 flex justify-center items-center">
              <Image
                src={PreviewImage}
                alt="App Preview"
                className="rounded-lg"
                layout="intrinsic"
                width={1200}
                height={600}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
