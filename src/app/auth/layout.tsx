"use client";

import {Sidebar, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import AppSidebar from "@/components/custom/app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
      <>
          <SidebarProvider>
              <AppSidebar />
              <main className={"flex-1 transition-colors duration-500"}>
                  <SidebarTrigger className={"text-accent-red-triangulo ml-1 mt-1 size-10!"} title={"Esconder"}/>
                  {children}
              </main>
          </SidebarProvider>
      </>
  );
}
