"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SunIcon, MoonIcon } from "lucide-react";

import { useEffect, useState } from "react";

export function SwitchThemeBox() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // evita mismatch no SSR

    return (
        <div style={{ padding: "1rem" }}>
            <div className="flex items-center justify-end space-x-2 mb-4">
                <Switch
                    id="theme-switch"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    className="data-[state=unchecked]:bg-orange-600 data-[state=checked]:bg-indigo-400"
                />
                <label htmlFor="theme-switch" className="cursor-pointer">
                    {theme === "dark" ? (
                        <MoonIcon className="text-indigo-400" />
                    ) : (
                        <SunIcon className="text-orange-600" />
                    )}
                </label>
            </div>
        </div>
    );
}
