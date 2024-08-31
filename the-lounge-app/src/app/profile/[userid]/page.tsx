"use client"; // Ensure this is a client-side component if necessary

import React from "react";
import Image from "next/image";
import logo from "../../assets/logos/LoungeLogo.png"; // Adjust the path to go two directories back

const ProfileSettings = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-700 flex-col">
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
