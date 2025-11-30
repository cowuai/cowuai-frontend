// types/Doenca.ts
export interface Doenca {
  id: string; // BigInt no back, string no front
  nome: string;
  descricao?: string | null;
  ehCronica?: boolean;
  dataCadastro?: string;
  dataAtualizacao?: string;
}
