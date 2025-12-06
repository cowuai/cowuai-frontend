import {TipoVacina} from "@/types/tipoVacina";

export interface Animal {
    id: string;
    nome: string;
    tipoRaca: string;
    sexo: string;
    composicaoRacial?: string;
    dataNascimento?: string;
    numeroParticularProprietario?: string;
    registro?: string;
    status: StatusAnimal;
    peso?: number;
    localizacao: string;
    idPai?: string;
    pai?: Animal
    idMae?: string;
    mae?: Animal
    idFazenda: string;
    idProprietario: string;
    vacinacoes?: VacinaAplicada[];
    filhosComoPai?: Animal[];
    filhosComoMae?: Animal[];
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

export enum StatusAnimal {
    VIVO = 'VIVO',
    FALECIDO = 'FALECIDO',
    VENDIDO = 'VENDIDO',
    DOADO = 'DOADO',
    ROUBADO = 'ROUBADO',
    DOENTE = 'DOENTE'
}

export enum SexoAnimal {
    MACHO = 'MACHO',
    FEMEA = 'FEMEA',
}