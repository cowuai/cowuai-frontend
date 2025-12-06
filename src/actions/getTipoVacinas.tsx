'use server';

import {TipoVacina} from "@/types/tipoVacina";

export async function getTipoVacinas(accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipos-vacina`, {
        method: 'GET',
        // Revalida o cache a cada 300 segundos (5 minutos)
        next: { revalidate: 300 },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tipos de vacina: ${res.status} ${res.statusText}`);
    }

    return await res.json() as TipoVacina[];
}