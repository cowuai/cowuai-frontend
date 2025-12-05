'use server';

import {Animal} from "@/types/Animal";

export async function getAnimal(accessToken: string, id: string) {
    console.log("Buscando animal com ID:", id + " usando token:", accessToken);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais/id/${id}`, {
        method: 'GET',
        cache: 'no-store',
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