"use client";

import React, { useState } from "react";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../lib/firebase/auth"; // Import the logOut function

const ProfileDropdown = () => {
  const { user } = useAuth(); // Assuming useAuth provides the authenticated user object
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await logOut(); // Sign out the user
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (!user) {
    return (
      <Link href="/login">
        <button className="bg-[#FFB6A9] text-[#1B1F3B] py-3 px-6 rounded-full font-semibold">
          Log In
        </button>
      </Link>
    );
  }

  return (
    <div className="relative inline-block">
      <button onClick={handleToggleDropdown} className="focus:outline-none">
        <PersonIcon className="text-white h-8 w-8 cursor-pointer" />
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2C3E50] text-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href={`/profile/${user.uid}`}
              className="block px-4 py-2 text-sm text-white hover:bg-purple-500"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
