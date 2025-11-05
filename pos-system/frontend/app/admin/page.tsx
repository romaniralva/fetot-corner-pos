"use client";

import ProtectedLayout from "../components/ProtectedLayout";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  return (
    <ProtectedLayout allowedRoles={["Admin"]}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold">Users</h2>
              <p>Manage employees and their roles</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold">Sales Reports</h2>
              <p>View daily, weekly, monthly reports</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold">POS Access</h2>
              <p>Quick link to POS page</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}
