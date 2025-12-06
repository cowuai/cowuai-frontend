export async function apiFetch(
    url: string,
    init: RequestInit = {},
    accessToken?: string
) {
    // 1. Configuração de Headers
    const headers = new Headers(init.headers || {});

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Só adiciona Content-Type se tiver body e não tiver sido setado manualmente (ex: FormData não pode ter esse header fixo)
    if (!headers.has("Content-Type") && init.body && typeof init.body === 'string') {
        headers.set("Content-Type", "application/json");
    }

    // 2. RETORNO IMEDIATO
    return fetch(url, { ...init, headers });
}