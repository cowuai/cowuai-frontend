'use client';

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import DeviceInfo from "@/helpers/deviceInfo";
import {Spinner} from "@/components/ui/spinner";
import {Usuario} from "@/types/usuario";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    refresh: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const dispositivo = DeviceInfo();

    useEffect(() => {
        const attemptRefresh = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error("Falha ao atualizar o token:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!accessToken) {
            attemptRefresh();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, senha: string): Promise<boolean> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, senha, dispositivo}),
            credentials: 'include'
        });

        if (!res.ok) return false;

        const data = await res.json();
        setAccessToken(data.accessToken);
        setUsuario(data.user);
        return true;
    };

    const logout = async (): Promise<boolean> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        if (!res.ok) {
            setAccessToken(null);
            setUsuario(null);
            return false;
        }

        setAccessToken(null);
        setUsuario(null);
        return true;
    }

    const refresh = async (): Promise<boolean> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({dispositivo}),
                credentials: 'include'
            });

            if (!res.ok) {
                console.error("Refresh falhou com o status:", res.status); // Log para debug
                setAccessToken(null); // Limpa o estado se a resposta não for OK
                setUsuario(null);  // <<<  garantir limpeza
                return false;
            }
            const data = await res.json();
            setAccessToken(data.accessToken);
            setUsuario(data.user || null);   // <<< repõe o usuário
            return true;
        } catch (error) { // Pega erros de fetch (rede, etc.)
            console.error("Erro durante o recarregamento:", error);
            setAccessToken(null); // Limpa o estado em caso de erro
            setUsuario(null);   // <<< garantir limpeza
            return false;
        }
    }

    if (loading) {
        return <div className={"flex items-center justify-center h-screen"}>
            <Spinner/>
        </div>
    }

    return <AuthContext.Provider value={{
        accessToken,
        setAccessToken,
        usuario,
        setUsuario,
        login,
        logout,
        refresh
    }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}