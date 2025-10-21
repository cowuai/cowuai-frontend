'use server';

import {Animal} from "@/types/Animal";

export async function getAnimal(accessToken: string, id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais/${id}`, {
        method: 'GET',
        next: { revalidate: 300 },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch animal: ${res.status} ${res.statusText}`);
    }

    return await res.json() as Animal;
}