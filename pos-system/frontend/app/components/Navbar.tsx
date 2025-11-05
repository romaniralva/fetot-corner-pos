"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  const handleLogout = async () => {
    await logout(); // clear user session and context
    router.replace("/"); // redirect to root
  };

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-3">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Fetot-Corner-POS
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
