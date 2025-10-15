import {LogOut} from "lucide-react";
import React from "react";
import {useLogout} from "@/hooks/UseLogout";

export default function LogoutButton() {
    const handleLogout = useLogout();

    return (
        <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-transparent border-none p-0 m-0 cursor-pointer"
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <LogOut className="text-accent-red-triangulo transition-transform duration-200 hover:scale-110" size={20} />
        </button>
    )
}