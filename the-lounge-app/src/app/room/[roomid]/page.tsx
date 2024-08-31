"use client"; // Ensure this is a client-side component if necessary

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the ArrowBackIcon
import logo from "../../assets/logos/LoungeLogo.png"; // Adjust the path to go two directories back

const ProfileSettings = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-purple-700 flex-col">
      {/* Back Button in the top left corner */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center text-white text-lg bg-black p-2 rounded-md">
            <ArrowBackIcon className="mr-2" />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Lounge Logo on top */}
      <div className="mb-4">
        <Image src={logo} alt="Lounge Logo" className="w-auto h-20" />
      </div>

      {/* Box with message */}
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-black">Nothing to see here</h1>
      </div>
    </div>
  );
};

export default ProfileSettings;
