'use server';

import {Animal} from "@/types/animal";

export async function getAnimalRelation(accessToken: string, id: string, relacao: 'pais' | 'filhos' | 'vacinacoes') {
    const res    = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais/relation/${id}/${relacao}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch animal relation: ${res.status} ${res.statusText}`);
    }

    return await res.json() as Animal;
}