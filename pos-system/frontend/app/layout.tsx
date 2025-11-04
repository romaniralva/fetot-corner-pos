import "./globals.css";
import Navbar from "./components/Navbar";
import { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Fetot-Corner-POS",
  description: "POS system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
