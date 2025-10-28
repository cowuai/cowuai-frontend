'use server';

export async function getProfile(accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perfil/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Falha ao buscar contagem de animais');
    }

    const data = await res.json();
    return data.profile;
}