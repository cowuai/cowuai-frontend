"use client";

import Sidebar from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen transition-colors duration-500 bg-background text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 transition-colors duration-500">{children}</main>
    </div>
  );
}
