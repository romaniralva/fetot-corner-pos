"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { role, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return null; // wait until AuthContext is loaded

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-3">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Fetot-Corner-POS
      </div>

      <div className="flex items-center space-x-4">
        {role === "Admin" && (
          <button
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        )}
        {role && (
          <button
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
