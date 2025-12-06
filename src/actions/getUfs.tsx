'use server';

import {Estado} from "@/types/estado";

export async function getUfs() {
    const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
        method: 'GET',
        cache: 'force-cache',
        next: {revalidate: 60 * 60 * 24}, // 24 horas
    });
    if (!res.ok) {
        throw new Error('Falha ao buscar UFs');
    }
    return await res.json() as Promise<Estado[]>;
}