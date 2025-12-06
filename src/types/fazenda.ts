export type Fazenda = {
    id: string;
    idProprietario: string;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    pais: string;
    porte: 'PEQUENO' | 'MEDIO' | 'GRANDE';
    prefixo: boolean;
    sufixo: boolean;
    afixo: string;
    dataCadastro: string;
    dataAtualizacao: string;
}