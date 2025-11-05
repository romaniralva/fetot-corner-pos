// src/app/pos/layout.tsx
"use client";
import ProtectedLayout from "../components/ProtectedLayout";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["Cashier", "Admin"]}>
      {children}
    </ProtectedLayout>
  );
}
