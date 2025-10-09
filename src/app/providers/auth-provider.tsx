'use client';

import React, {createContext, useContext, useState, ReactNode} from 'react';
import DeviceInfo from "@/helpers/DeviceInfo";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    usuario?: Usuario | null;
    setUsuario?: (usuario: Usuario | null) => void;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: (idUsuario: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const dispositivo = DeviceInfo();

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

    const logout = async (idUsuario: string): Promise<boolean> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idUsuario}),
            credentials: 'include'
        });

        console.log(res);

        if (!res.ok) return false;
        setAccessToken(null);
        return true;
    }

    return <AuthContext.Provider value={{accessToken, setAccessToken, usuario, setUsuario, login, logout}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}