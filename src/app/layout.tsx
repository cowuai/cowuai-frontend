import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import {AuthProvider} from "@/app/providers/AuthProvider";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "CowUai",
    description: "Sua plataforma de manejo de gado pensada para o futuro.",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <>
            <html lang="pt-BR" suppressHydrationWarning={true}>
            <body className={`antialiased`}>
            <AuthProvider>
                {children}
                <Toaster/>
            </AuthProvider>
            </body>
            </html>
        </>
    )
}
