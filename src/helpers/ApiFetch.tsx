export async function apiFetch(
  url: string,
  init: RequestInit = {},
  accessToken?: string
) {
  const headers = new Headers(init.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    // tenta extrair mensagem amigável do back
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data?.message || data?.error || message) as string;
    } catch {
      // keep default
    }
    throw new Error(message);
  }

  // tenta parsear json; se não for json, retorna vazio
  try {
    return await res.json();
  } catch {
    return null;
  }
}
