// actions/getDoencasByAnimal.tsx
"use server";

import { DoencaAnimal } from "@/types/DoencaAnimal";

export async function getDoencasByAnimal(
  accessToken: string,
  idAnimal: string,
  somenteAtivas: boolean = false
): Promise<DoencaAnimal[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  }

  const suffix = somenteAtivas ? "/ativas" : "";
  const url = `${baseUrl}/doencas-animal/animal/${idAnimal}${suffix}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar doenças do animal: ${res.status}`);
  }

  return (await res.json()) as DoencaAnimal[];
}
