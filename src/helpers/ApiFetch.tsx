import { useAuth } from "@/app/providers/AuthProvider";

export async function apiFetch(url: string, options: RequestInit = {}) {
    const { accessToken, setAccessToken } = useAuth();

    let headers: any = options.headers || {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    let res = await fetch(url, { ...options, headers, credentials: "include" });

    if (res.status === 401) {
        // tenta renovar
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!refreshRes.ok) throw new Error("Sessão expirada");

        const data = await refreshRes.json();
        setAccessToken(data.accessToken);

        // repete request original
        headers["Authorization"] = `Bearer ${data.accessToken}`;
        res = await fetch(url, { ...options, headers, credentials: "include" });
    }

    return res.json();
}