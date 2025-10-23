import {TipoVacina} from "@/types/TipoVacina";

export interface Animal {
    id: string;
    nome: string;
    tipoRaca: string;
    sexo: string;
    composicaoRacial?: string;
    dataNascimento?: string;
    numeroParticularProprietario?: string;
    registro?: string;
    status: string;
    peso: number;
    localizacao: string;
    idPai?: string;
    pai?: Animal
    idMae?: string;
    mae?: Animal
    idFazenda: string;
    idProprietario: string;
    vacinacoes: VacinaAplicada[];
    filhos: Animal[];
}

export interface VacinaAplicada {
    id: string;
    idAnimal: string;
    tipoVacina: TipoVacina;
    idTipoVacina: string;
    dataAplicacao: string;
    proximaDose?: string;
    numeroDose?: number;
    lote?: string;
    veterinario?: string;
    observacoes?: string;
    dataCadastro: string;
    dataAtualizacao: string;
}