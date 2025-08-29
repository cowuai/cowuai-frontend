import type {Metadata} from "next";
import {Ubuntu_Sans, Tsukimi_Rounded} from "next/font/google";
import "./globals.css";
import {SwitchThemeBox} from "@/components/ui/switch-theme-box";
import {ThemeProvider} from "@/components/theme-provider"

const ubuntu = Ubuntu_Sans({
    variable: "--font-ubuntu",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const tsukimiRounded = Tsukimi_Rounded({
    variable: "--font-tsukimi-rounded",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "CowUai",
    description: "Sua plataforma de manejo de gado pensada para o futuro.",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <>
            <html lang="pt-BR" suppressHydrationWarning>
            <head/>
            <body className={`${ubuntu.variable} ${tsukimiRounded.variable} antialiased`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
          <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 transition-colors duration-500 flex items-center justify-end px-4">
            <SwitchThemeBox />
          </div>
                {children}
            </ThemeProvider>
            </body>
            </html>
        </>
    )
}
