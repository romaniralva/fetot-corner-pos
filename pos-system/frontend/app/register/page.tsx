"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const roleRedirect: { [key: string]: string } = {
  Admin: "/admin",
  Cashier: "/pos",
  Manager: "/manager",
};

export default function RootPage() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Auto-redirect logged-in users
  useEffect(() => {
    if (!loading && user) {
      router.replace(roleRedirect[user.role] || "/");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      await refreshUser(); // update context
      toast.success("Login successful!");

      if (res.data.role) {
        router.replace(roleRedirect[res.data.role]);
      } else {
        router.replace("/"); // fallback
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      setSubmitting(false);
    }
  };

  // Show loading while checking session
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl w-96 mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
