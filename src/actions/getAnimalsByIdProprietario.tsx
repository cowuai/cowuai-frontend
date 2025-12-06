"use server";
import { Animal } from "@/types/animal";

export type PaginatedAnimals = {
    data: Animal[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
};

export async function getAnimalsByIdProprietario(
    accessToken: string,
    idProprietario: string,
    page?: number,
    pageSize?: number
): Promise<Animal[] | PaginatedAnimals> {
    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    const path = `/animais/proprietario/${encodeURIComponent(idProprietario)}`;
    const params = new URLSearchParams();

    // Determina se é uma chamada paginada baseada na existência dos params
    const isPaginated = page !== undefined || pageSize !== undefined;

    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));

    const url = `${base}${path}${params.toString() ? `?${params.toString()}` : ''}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store', // Opcional: garante dados frescos
    });

    // 1. Tratamento de Casos Vazios (204 No Content ou 404 Not Found)
    // Se a regra de negócio for "não achou = lista vazia", mantemos isso.
    if (res.status === 204 || res.status === 404) {
        return getEmptyResponse(isPaginated, page, pageSize);
    }

    // 2. Tratamento de Erro HTTP
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(errorBody || 'Falha ao buscar animais por proprietário');
    }

    // 3. Sucesso: Parse e Retorno
    const responseBody = await res.json();

    if (isPaginated) {
        // O backend garante a estrutura { data: [...], pagination: {...} }
        return responseBody as PaginatedAnimals;
    }

    // O backend sem paginação retorna { data: [...] }, mas o front espera apenas Animal[]
    return responseBody.data as Animal[];
}

// Helper para evitar repetição de código no retorno vazio
function getEmptyResponse(isPaginated: boolean, page?: number, pageSize?: number) {
    if (isPaginated) {
        return {
            data: [],
            pagination: {
                page: page ?? 1,
                pageSize: pageSize ?? 10,
                totalItems: 0,
                totalPages: 0,
            },
        } as PaginatedAnimals;
    }
    return [] as Animal[];
}