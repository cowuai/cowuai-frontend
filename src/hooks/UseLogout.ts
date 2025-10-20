import {useAuth} from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation"; // Use o useRouter para navegação em client components

export function useLogout() {
    const { logout } = useAuth();
    const router = useRouter();

    return async () => {
        const success = await logout();
        if (success) {
            router.push("/login");
        } else {
            console.error("Falha no logout.");
            // Mesmo com falha, redireciona para o login
            // para forçar uma nova autenticação.
            router.push("/login");
        }
    };
}