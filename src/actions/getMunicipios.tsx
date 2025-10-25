'use server';

import {Municipio} from "@/types/Municipio";

export async function getMunicipios(uf: string) {
    const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, {
        method: 'GET',
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Falha ao buscar municípios');
    }
    return await res.json() as Municipio[];
}