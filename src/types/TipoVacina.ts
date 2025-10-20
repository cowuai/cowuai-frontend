export interface TipoVacina {
    id: string;
    nome: string;
    descricao?: string | null;
    obrigatoria: boolean;
    generoAlvo?: SexoAnimal | null;
    minIdadeMeses?: number | null;
    maxIdadeMeses?: number | null;
    frequencia: FrequenciaVacina;
    dataCadastro: string;
    dataAtualizacao?: string | null;
}

export enum FrequenciaVacina {
    ANUAL = 'ANUAL',
    SEMESTRAL = 'SEMESTRAL',
    TRIMESTRAL = 'TRIMESTRAL',
    BIMESTRAL = 'BIMESTRAL',
    MENSAL = 'MENSAL',
    DOSE_UNICA = 'DOSE_UNICA',
    REFORCO = 'REFORCO',
}

export enum SexoAnimal {
    MACHO = 'MACHO',
    FEMEA = 'FEMEA',
    TODOS = 'TODOS',
}