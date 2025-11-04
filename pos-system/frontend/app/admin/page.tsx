import ProtectedLayout from "../components/ProtectedLayout";

export default function AdminPage() {
  return (
    <ProtectedLayout allowedRoles={["Admin"]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
    </ProtectedLayout>
  );
}
