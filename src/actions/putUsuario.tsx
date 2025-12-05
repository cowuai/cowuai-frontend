'use server';

import { Usuario } from "@/types/Usuario";
import { updateUsuarioSchema } from "@/zodSchemes/usuarioScheme";
import { z } from "zod";

export async function putUsuario(accessToken: string, usuario: Usuario) {
    // Desestrutura o objeto: separa o 'id' e mantém o restante no payload
    const { id, ...payload } = usuario as any;
    try {
        updateUsuarioSchema.parse(payload);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const message = 'Dados inválidos: ' + JSON.stringify(err.issues);
            throw new Error(message);
        }
        throw err;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Falha ao atualizar usuário');
    }

    const data = await res.json();
    return data as Usuario;
}