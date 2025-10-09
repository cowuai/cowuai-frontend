import type {Metadata} from "next";
import "./globals.css";
import {SwitchThemeBox} from "@/components/custom/switch-theme-box";
import {ThemeProvider} from "@/app/providers/theme-provider"
import React from "react";
import LogoutButton from "@/components/custom/logout-button";
import {HeaderActions} from "@/components/custom/header-actions";
import {AuthProvider} from "@/app/providers/auth-provider";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "CowUai",
    description: "Sua plataforma de manejo de gado pensada para o futuro.",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <>
            <html lang="pt-BR" suppressHydrationWarning>
            <body className={`antialiased`}>
            <AuthProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HeaderActions/>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
            </body>
            </html>
        </>
    )
}
