"use client";

import {Switch} from "@/components/ui/switch";
import {useState} from "react";
import {theme} from "@/app/styles/theme";

type SwitchThemeBoxProps = {
    modeInicial?: "light" | "dark";
    onModeChange?: (mode: "light" | "dark") => void;
};

export function SwitchThemeBox({ modeInicial = "light", onModeChange }: SwitchThemeBoxProps) {
    const [mode, setMode] = useState<"light" | "dark">(modeInicial);

    const handleSwitch = () => {
        const novoModo = mode === "light" ? "dark" : "light";
        setMode(novoModo);
        if (onModeChange) onModeChange(novoModo);
    };

    return (
        <div style={{
            background: theme[mode].colors.background,
            color: theme[mode].colors.text,
            padding: "1rem",
        }}>
            <div className="flex items-center space-x-2 mb-4">
                <Switch
                    id="theme-switch"
                    checked={mode === "dark"}
                    onCheckedChange={handleSwitch}
                />
                <img
                    src={mode === "light" ? "/images/ic_sun.svg" : "/images/ic_moon.svg"}
                    alt={mode === "light" ? "Sol" : "Lua"}
                    className="w-6 h-6"
                />
            </div>
        </div>
    );
}