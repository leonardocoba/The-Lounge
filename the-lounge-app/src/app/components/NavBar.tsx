"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logos/LoungeLogo.png";
import "../globals.css";
import { useAuth } from "../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import { logOut } from "../lib/firebase/auth"; // Import the logOut function

const Navbar = () => {
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

  return (
    <div className="flex items-center justify-between p-4 bg-[#2C3E50] rounded-full shadow-lg">
      {/* Logo on the far left */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <Image
            src={logo}
            alt="Lounge Logo"
            className="w-auto h-10" // Adjust the height as needed
            priority
          />
        </Link>
      </div>

      {/* Centered navigation links */}
      <ul className="flex space-x-8 text-white text-xl">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>

      {/* Conditional rendering for login button or person icon */}
      <div className="relative">
        {user ? (
          <div className="relative inline-block">
            <button
              onClick={handleToggleDropdown}
              className="focus:outline-none"
            >
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
        ) : (
          <Link href="/login">
            <button className="bg-[#FFB6A9] text-[#1B1F3B] py-3 px-6 rounded-full font-semibold">
              Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
