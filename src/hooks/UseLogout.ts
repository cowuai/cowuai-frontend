import {useAuth} from "@/app/providers/AuthProvider";
import {redirect} from "next/navigation";

export function useLogout() {
    const { logout, usuario } = useAuth();

    return async () => {
        if (usuario) {
            console.log("Fazendo logout do usuário:", usuario.id);
            const success = await logout(usuario.id);
            if (success) {
                redirect("/login");
            } else {
                console.error("Falha no logout.");
            }
        }
    };
}
