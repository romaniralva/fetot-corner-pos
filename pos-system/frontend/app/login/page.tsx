"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const roleRedirect: { [key: string]: string } = {
  Admin: "/admin",
  Cashier: "/pos",
  Manager: "/manager",
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth(); // only call after login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Update AuthContext AFTER successful login
      await refreshUser();

      toast.success("Login successful!");

      const { role } = res.data;
      router.push(roleRedirect[role] || "/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

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
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
