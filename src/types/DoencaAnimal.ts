// types/DoencaAnimal.ts
import { Doenca } from "./Doenca";

export interface DoencaAnimal {
  id: string; // BigInt no back, string aqui
  idAnimal: string;
  idDoenca: string;
  dataDiagnostico: string;
  emTratamento: boolean;
  dataFimTratamento?: string | null;
  observacoes?: string | null;

  // relacionamento carregado com include no back
  doenca?: Doenca;
}
