// src/actions/getDoencasByAnimal.tsx
import { DoencaAnimal } from "@/types/DoencaAnimal";

export async function getDoencasByAnimal(
  accessToken: string,
  animalId: string,
  onlyActive = false
): Promise<DoencaAnimal[]> {
  if (!accessToken) {
    throw new Error("Token de acesso não informado.");
  }

  if (!animalId) {
    throw new Error("ID do animal não informado.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  }

  // Backend: app.use("/api/doencas-animal", doencaAnimalRoutes);
  // Rotas no router:
  //  GET /animal/:idAnimal
  //  GET /animal/:idAnimal/ativas
  const path = `/doencas-animal/animal/${animalId}${onlyActive ? "/ativas" : ""}`;
  const url = `${baseUrl}${path}`;

  console.log(
    `Buscando doenças do animal ${animalId}. onlyActive=${onlyActive} -> ${url}`
  );

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  // 👉 404: rota respondeu "não encontrado"
  // Em vez de quebrar tudo, só devolvemos lista vazia.
  if (res.status === 404) {
    console.warn(
      `Nenhuma doença encontrada para o animal ${animalId} (respondeu 404).`
    );
    return [];
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      "Erro HTTP ao buscar doenças do animal:",
      res.status,
      res.statusText,
      text
    );
    throw new Error(`Falha ao buscar doenças do animal: ${res.status}`);
  }

  const data = (await res.json()) as DoencaAnimal[];
  return data ?? [];
}
