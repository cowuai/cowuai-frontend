"use client";

import {Sidebar, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import AppSidebar from "@/components/custom/app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
      <>
          <SidebarProvider>
              <AppSidebar />
              <main className={"flex-1 transition-colors duration-500"}>
                  <SidebarTrigger/>
                  {children}
              </main>
          </SidebarProvider>
      </>
  );
}
