'use server';

import { Usuario } from "@/types/Usuario";

export async function putUsuario(accessToken: string, usuario: Usuario) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(usuario),
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Falha ao atualizar usuário');
    }

    const data = await res.json();
    return data as Usuario;
}