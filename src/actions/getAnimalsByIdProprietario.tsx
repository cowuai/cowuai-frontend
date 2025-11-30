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
        // Se a API retornar 404 (não encontrado) ou 204 (sem conteúdo),
        // consideramos que não há animais registrados para este proprietário
        // e retornamos um array vazio em vez de lançar erro.
        if (res.status === 404 || res.status === 204) {
            return [];
        }

        // Tenta extrair mensagem de erro do corpo, se houver
        let bodyText: string | null = null;
        try {
            bodyText = await res.text();
        } catch (_) {
            bodyText = null;
        }

        if (bodyText) {
            try {
                const parsedBody = JSON.parse(bodyText);
                const msg = parsedBody?.message ?? "";
                if (String(msg).toLowerCase().includes("nenhum animal")) {
                    return [];
                }
            } catch (_) {
                if (bodyText.toLowerCase().includes("nenhum animal")) {
                    return [];
                }
            }
        }

        throw new Error(bodyText && bodyText.length > 0
            ? `Falha ao buscar animais por proprietário: ${bodyText}`
            : 'Falha ao buscar animais por proprietário');
    }

    let text: string | null = null;
    try {
        text = await res.text();
    } catch (_) {
        text = null;
    }

    if (!text || text.trim().length === 0) {
        return [];
    }

    try {
        const parsed = JSON.parse(text);
        // Se o backend devolver um objeto com { message: 'Nenhum animal...' }
        // tratamos como vazio.
        if (!Array.isArray(parsed)) {
            const msg = parsed?.message ?? "";
            if (String(msg).toLowerCase().includes("nenhum animal")) {
                return [];
            }
            throw new Error('Resposta inválida ao buscar animais por proprietário');
        }

        return parsed as Animal[];
    } catch (e) {
        throw new Error('Resposta inválida ao buscar animais por proprietário');
    }
}