import ProtectedLayout from "../components/ProtectedLayout";

export default function POSPage() {
  return (
    <ProtectedLayout allowedRoles={["Cashier"]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">POS Page</h1>
        <p>Welcome, Cashier!</p>
      </div>
    </ProtectedLayout>
  );
}
