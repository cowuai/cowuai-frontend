// src/styles/theme.ts

export const theme = {
    light: {
        colors: {
            primary: "#7f1d1d",      // red-900
            text: "#0c0a09",         // stone-950
            background: "#E5E5E5",   // stone-100
            accent: {
                redTriangulo: "#f63940",
                orange: "#fb923c",
                yellow: "#fde047",
            },
        },
    },
    dark: {
        colors: {
            primary: "#7f1d1d",      // red-900
            text: "#f5f5f4",         // stone-100
            background: "#0c0a09",   // stone-950
            accent: {
                redTriangulo: "#f63940",
                blue: "#2563eb",       // blue-600
                cyan: "#06b6d4",       // cyan-500
            },
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        fontSize: {
            sm: "0.875rem", // 14px
            base: "1rem",   // 16px
            lg: "1.125rem", // 18px
            xl: "1.25rem",  // 20px
        },
    },
    spacing: (factor: number) => `${factor * 8}px`, // ex: spacing(2) -> 16px
} as const;

export type ThemeScheme = keyof typeof theme; // "light" | "dark"
