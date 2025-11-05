"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (loading) return;

    const handlePopState = () => {
      if (!user) router.replace("/");
    };

    window.addEventListener("popstate", handlePopState);

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.role === "Admin" || allowedRoles.includes(user.role)) {
      setAuthorized(true);
      setShowModal(false);
    } else {
      setAuthorized(false);
      setShowModal(true);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Checking authorization...
        </p>
      </div>
    );
  }

  return (
    <>
      {authorized && <>{children}</>}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Unauthorized Access
            </h2>
            <p className="text-gray-600 mb-4">
              You don’t have permission to view this page.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                router.back();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
