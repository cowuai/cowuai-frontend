"use server";

import {Fazenda} from "@/types/Fazenda";

export async function getFazendasByIdProprietario(idProprietario: string, accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fazendas/proprietario/${idProprietario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Falha ao buscar fazendas por proprietário');
    }

    const data = await res.json();
    return data as Fazenda[];
}
