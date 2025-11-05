"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      sessionStorage.setItem("auth", "true"); // mark session
    } catch (err) {
      setUser(null);
      sessionStorage.removeItem("auth");
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
      setUser(null);
      sessionStorage.removeItem("auth");
    } catch (err) {
      console.error("Logout API failed", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
