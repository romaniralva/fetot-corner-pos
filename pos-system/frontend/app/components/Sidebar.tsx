"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import RegisterModal from "./RegisterModal"; // modal component

interface SidebarItem {
  name: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Reports", path: "/admin/reports" },
  { name: "POS Access", path: "/pos" },
];

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  // ❌ Important: initialize as false
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8">Admin Menu</div>
        <ul className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <li
              key={item.path}
              className="cursor-pointer px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </li>
          ))}

          {/* Register button only visible to Admin */}
          {user.role === "Admin" && (
            <li
              className="cursor-pointer px-4 py-2 rounded hover:bg-gray-700 mt-4 bg-green-600 text-white text-center"
              onClick={() => setShowRegisterModal(true)} // open modal on click
            >
              Register User
            </li>
          )}
        </ul>
      </aside>

      {/* Render modal only if showRegisterModal is true */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
}
