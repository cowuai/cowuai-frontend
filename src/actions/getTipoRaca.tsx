'use server';

export async function getTipoRaca(accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipos-raca/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Falha ao buscar tipos e raças');
    }

    const data = await res.json();
    return data as string[];
}