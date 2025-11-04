"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProtectedLayout from "../components/ProtectedLayout";
import { useAuth } from "../context/AuthContext";

const roles = ["Admin", "Cashier", "Manager"]; // Role enum

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState(roles[1]); // default Cashier

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/auth/register`,
        { name, email, password, position, contactNo, address, role },
        { withCredentials: true }
      );

      toast.success("User registered successfully!");
      await refreshUser(); // refresh context if needed
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <ProtectedLayout allowedRoles={["Admin"]}>
      <div className="bg-white shadow-lg p-6 rounded-2xl w-96 mx-auto mt-20">
        <h1 className="text-2xl font-bold text-center mb-4">Register User</h1>

        <form onSubmit={handleRegister} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
            className="border p-2 rounded"
          />
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
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Contact No"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="border p-2 rounded"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </ProtectedLayout>
  );
}
