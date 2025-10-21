import {SexoAnimal} from "@/types/TipoVacina";

export interface Animal {
    id: string;
    nome: string;
    registro: string;
    tipoRaca: string;
    sexo: SexoAnimal;
    dataNascimento: string;
    peso: number;
    status: StatusAnimal;
    pai?: Animal
    mae?: Animal
    vacinacoes: Vaccine[];
    offspring: Offspring[];
}

export interface Vaccine {
    id: string;
    name: string;
    date: string;
    nextDate?: string;
    veterinarian: string;
    notes?: string;
}

export interface Offspring {
    id: string;
    name: string;
    tag: string;
    birthDate: string;
    gender: "Macho" | "Fêmea";
    otherParent: {
        id: string;
        name: string;
        tag: string;
    };
}

export enum StatusAnimal {
    VIVO = "Vivo",
    FALECIDO = "Falecido",
    VENDIDO = "Vendido",
    DOADO = "Doado",
    ROUBADO = "Roubado"
}