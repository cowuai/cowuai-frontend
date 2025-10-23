'use server';

import {Animal} from "@/types/Animal";

export async function getAnimalRelation(accessToken: string, id: string, relacao: 'pais' | 'filhos' | 'vacinacoes') {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais/${id}/${relacao}`, {
        method: 'GET',
        next: { revalidate: 300 },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch animal relation: ${res.status} ${res.statusText}`);
    }

    return await res.json() as Animal | Animal[] | any[];
}