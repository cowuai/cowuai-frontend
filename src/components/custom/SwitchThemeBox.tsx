"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SunIcon, MoonIcon } from "lucide-react";

export function SwitchThemeBox() {
    const { setTheme, theme, resolvedTheme } = useTheme();

    const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

    return (
        <div className="flex items-center justify-end space-x-2">
            <Switch
                id="theme-switch"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=unchecked]:bg-orange-600 data-[state=checked]:bg-indigo-400"
            />
            <label htmlFor="theme-switch" className="cursor-pointer">
                {isDark ? (
                    <MoonIcon className="text-indigo-400 size-5"/>
                ) : (
                    <SunIcon className="text-orange-600 size-5"/>
                )}
            </label>
        </div>
    );
}