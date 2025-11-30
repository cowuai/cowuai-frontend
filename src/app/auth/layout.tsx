"use client";

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ReactNode} from "react";
import AppSidebar from "@/components/custom/AppSidebar";
import {HeaderActions} from "@/components/custom/HeaderActions";
import {ThemeProvider} from "@/app/providers/ThemeProvider";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SidebarProvider>
                    <AppSidebar/>
                    <main className={"flex-1 transition-colors duration-500 bg-background min-h-screen"}>
                        <div className={"flex justify-between items-center bg-card"}>
                            <SidebarTrigger className={"text-accent-red-triangulo ml-1 size-10!"} title={"Esconder"}/>
                            <HeaderActions/>
                        </div>
                        <div className={"flex justify-center mt-6 px-4 md:px-8 lg:px-16 pb-16"}>
                            <div className={"w-full bg-card border border-card rounded-lg p-6 shadow-sm"}>
                            {children}
                            </div>
                        </div>
                    </main>
                </SidebarProvider>
            </ThemeProvider>
        </>
    );
}
