"use client";

import { WebRTCProvider } from "./context/WebRTCContext";
import React from "react";
import { AuthProvider } from "./context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WebRTCProvider>{children}</WebRTCProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
