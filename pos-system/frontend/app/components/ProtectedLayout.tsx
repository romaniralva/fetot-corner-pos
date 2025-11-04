"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ProtectedLayoutProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function ProtectedLayout({
  allowedRoles,
  children,
}: ProtectedLayoutProps) {
  const { role, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!role) {
        await refreshUser(); // fetch role if not loaded
        return;
      }

      // Admin bypass: can access all pages
      if (role !== "Admin" && !allowedRoles.includes(role)) {
        router.push("/login"); // redirect unauthorized roles
      }
    };

    checkAccess();
  }, [role, allowedRoles, router, refreshUser]);

  if (loading || !role) return <div>Loading...</div>; // optional loading

  return <>{children}</>;
}
