import { Animal } from "@/types/Animal";

export const mockAnimals: Animal[] = [
    {
        id: "1",
        nome: "Estrela",
        tag: "BR-001",
        species: "Bovino",
        breed: "Nelore",
        gender: "Fêmea",
        birthDate: "2020-03-15",
        weight: 450,
        status: "Ativo",
        location: "Pasto 1 - Setor A",
        father: {
            id: "10",
            name: "Relâmpago",
            tag: "BR-045"
        },
        mother: {
            id: "11",
            name: "Aurora",
            tag: "BR-032"
        },
        vaccines: [
            {
                id: "v1",
                name: "Febre Aftosa",
                date: "2024-05-10",
                nextDate: "2024-11-10",
                veterinarian: "Dr. Carlos Silva",
                notes: "Aplicação sem reações"
            },
            {
                id: "v2",
                name: "Brucelose",
                date: "2024-03-22",
                veterinarian: "Dra. Ana Paula",
            },
            {
                id: "v3",
                name: "Clostridioses",
                date: "2024-06-01",
                nextDate: "2025-06-01",
                veterinarian: "Dr. Carlos Silva",
            }
        ],
        offspring: [
            {
                id: "20",
                name: "Cometa",
                tag: "BR-089",
                birthDate: "2023-08-12",
                gender: "Macho",
                otherParent: {
                    id: "15",
                    name: "Trovão",
                    tag: "BR-056"
                }
            },
            {
                id: "21",
                name: "Luna",
                tag: "BR-090",
                birthDate: "2024-02-28",
                gender: "Fêmea",
                otherParent: {
                    id: "15",
                    name: "Trovão",
                    tag: "BR-056"
                }
            }
        ]
    },
    {
        id: "2",
        name: "Tornado",
        tag: "BR-002",
        species: "Bovino",
        breed: "Angus",
        gender: "Macho",
        birthDate: "2019-11-20",
        weight: 620,
        status: "Ativo",
        location: "Pasto 3 - Setor B",
        father: {
            id: "12",
            name: "Furacão",
            tag: "BR-023"
        },
        mother: {
            id: "13",
            name: "Bonança",
            tag: "BR-018"
        },
        vaccines: [
            {
                id: "v4",
                name: "Febre Aftosa",
                date: "2024-05-12",
                nextDate: "2024-11-12",
                veterinarian: "Dr. Carlos Silva",
            },
            {
                id: "v5",
                name: "Raiva",
                date: "2024-04-05",
                nextDate: "2025-04-05",
                veterinarian: "Dra. Ana Paula",
                notes: "Reforço anual"
            }
        ],
        offspring: []
    },
    {
        id: "3",
        name: "Primavera",
        tag: "BR-003",
        species: "Bovino",
        breed: "Girolando",
        gender: "Fêmea",
        birthDate: "2021-06-08",
        weight: 380,
        status: "Ativo",
        location: "Curral de Ordenha",
        father: {
            id: "14",
            name: "Safira",
            tag: "BR-067"
        },
        mother: {
            id: "15",
            name: "Diamante",
            tag: "BR-041"
        },
        vaccines: [
            {
                id: "v6",
                name: "Febre Aftosa",
                date: "2024-05-15",
                nextDate: "2024-11-15",
                veterinarian: "Dr. Carlos Silva",
            }
        ],
        offspring: [
            {
                id: "22",
                name: "Verão",
                tag: "BR-105",
                birthDate: "2024-01-20",
                gender: "Macho",
                otherParent: {
                    id: "2",
                    name: "Tornado",
                    tag: "BR-002"
                }
            }
        ]
    },
    {
        id: "4",
        name: "Valente",
        tag: "BR-004",
        species: "Bovino",
        breed: "Brahman",
        gender: "Macho",
        birthDate: "2018-09-14",
        weight: 780,
        status: "Ativo",
        location: "Pasto 5 - Setor C",
        vaccines: [
            {
                id: "v7",
                name: "Febre Aftosa",
                date: "2024-05-08",
                nextDate: "2024-11-08",
                veterinarian: "Dr. Carlos Silva",
            },
            {
                id: "v8",
                name: "Carbúnculo",
                date: "2024-03-15",
                nextDate: "2025-03-15",
                veterinarian: "Dra. Ana Paula",
            }
        ],
        offspring: []
    }
];
