import {Estado} from "@/types/estado";

export interface Municipio {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: Estado
        }
    };
    regiaoImediata: {
        id: number;
        nome: string;
        regiaoIntermediaria: {
            id: number;
            nome: string;
            UF: Estado
        }
    }
}