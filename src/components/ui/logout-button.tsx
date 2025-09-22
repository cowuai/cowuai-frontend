import {LogOut} from "lucide-react";
import React from "react";
import {useAuth} from "@/app/providers/AuthProvider";
import {redirect} from "next/navigation";

export default function LogoutButton() {
    const {logout, idUsuario} = useAuth();

    const handleLogout = async () => {
        if (idUsuario) {
            console.log("Fazendo logout do usuário:", idUsuario);
            const success = await logout(idUsuario);
            if (success) {
                redirect('/login');
            } else {
                console.error("Falha no logout.");
            }
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-transparent border-none p-0 m-0 cursor-pointer"
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <LogOut className="text-primary transition-transform duration-200 hover:scale-110" size={20} />
        </button>
    )
}