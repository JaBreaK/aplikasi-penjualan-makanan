import AdminNavbar from "@/components/AdminNavbar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <main>
        {children}
      </main>
    </div>
  );
}