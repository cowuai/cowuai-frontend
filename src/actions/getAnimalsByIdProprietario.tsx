"use server";
import { Animal } from "@/types/Animal";

export async function getAnimalsByIdProprietario(accessToken: string, idProprietario: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais/proprietario/${idProprietario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Falha ao buscar animais por proprietário');
    }

    const data = await res.json();
    return data as Animal[];
}