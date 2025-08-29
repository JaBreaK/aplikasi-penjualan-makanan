"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar"; // <-- Import sidebar
import { Menu } from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <main className="lg:pl-64 transition-all duration-300">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:hidden">
              <button onClick={toggleSidebar}>
                  <Menu className="h-6 w-6"/>
              </button>
              <h1 className="font-semibold text-lg">Admin Dashboard</h1>
          </header>
          <div className="p-4 md:p-8">
            {children}
          </div>
      </main>
    </div>
  );
}