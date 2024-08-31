"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logos/LoungeLogo.png";
import "../globals.css";
import ProfileDropdown from "./ProfileDropdown"; // Import the ProfileDropdown component

const Navbar = () => {
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

      {/* Profile dropdown or login button */}
      <ProfileDropdown />
    </div>
  );
};

export default Navbar;
