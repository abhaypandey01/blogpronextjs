"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification, NotificationProvider } from "@/components/Notification";

function HeaderContent() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo and Home Link */}
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-2 hover:text-gray-300 transition"
          onClick={() =>
            showNotification("Welcome to ImageKit ReelsPro", "info")
          }
        >
          <Home className="w-6 h-6" />
          ImageKit ReelsPro
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            <User className="w-5 h-5" />
            {session ? session.user?.email?.split("@")[0] : "Guest"}
          </button>

          {/* Dropdown Menu */}
          <ul className="absolute right-0 mt-2 bg-gray-700 text-white rounded-lg shadow-lg w-48">
            {session ? (
              <>
                <li className="px-4 py-2 text-sm text-gray-300">
                  Logged in as: <br />
                  <span className="font-bold">{session.user?.email}</span>
                </li>
                <hr className="border-gray-600" />
                <li>
                  <Link
                    href="/upload"
                    className="block px-4 py-2 hover:bg-gray-600 transition"
                    onClick={() =>
                      showNotification("Welcome to Video Upload", "info")
                    }
                  >
                    Video Upload
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-600 transition"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-600 transition"
                  onClick={() =>
                    showNotification("Please sign in to continue", "info")
                  }
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <NotificationProvider>
      <HeaderContent />
    </NotificationProvider>
  );
}