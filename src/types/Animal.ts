export interface Animal {
    id: string;
    name: string;
    tag: string;
    species: string;
    breed: string;
    gender: "Macho" | "Fêmea";
    birthDate: string;
    weight: number;
    status: "Ativo" | "Vendido" | "Falecido";
    image?: string;
    location: string;
    father?: {
        id: string;
        name: string;
        tag: string;
    };
    mother?: {
        id: string;
        name: string;
        tag: string;
    };
    vaccines: Vaccine[];
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
