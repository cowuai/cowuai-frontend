"use client";

import {Sidebar, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ReactNode, useState} from "react";
import AppSidebar from "@/components/custom/AppSidebar";
import {HeaderActions} from "@/components/custom/HeaderActions";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar/>
                <main className={"flex-1 transition-colors duration-500"}>
                    <div className={"flex justify-between items-center bg-card"}>
                        <SidebarTrigger className={"text-accent-red-triangulo ml-1 size-10!"} title={"Esconder"}/>
                        <HeaderActions/>
                    </div>
                    {children}
                </main>
            </SidebarProvider>
        </>
    );
}
