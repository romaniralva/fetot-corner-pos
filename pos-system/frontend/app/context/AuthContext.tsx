"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  role: string | null;
  uid: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Start false to avoid login page flicker
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setRole(res.data.user.role);
      setUid(res.data.user.uid);
    } catch {
      // silently handle 401 Unauthorized
      setRole(null);
      setUid(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setRole(null);
      setUid(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ role, uid, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
