"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { Tsukimi_Rounded } from "next/font/google";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa6";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

interface Animal {
  id: number;
  nome: string;
  tipoRaca: string;
  sexo: "Macho" | "Fêmea";
  composicaoRacial: string | null;
  dataNascimento: string | null;
  peso: number | null;
  idFazenda: number;
}

const MOCK_ANIMALS: Animal[] = [
  {
    id: 1,
    nome: "Mimosa",
    tipoRaca: "Nelore",
    sexo: "Fêmea",
    composicaoRacial: "Pura",
    dataNascimento: "2020-05-15T00:00:00Z",
    peso: 550,
    idFazenda: 1,
  },
  {
    id: 2,
    nome: "Touro Ferdinando",
    tipoRaca: "Angus",
    sexo: "Macho",
    composicaoRacial: "Puro de Origem",
    dataNascimento: "2019-11-01T00:00:00Z",
    peso: 1200,
    idFazenda: 1,
  },
  {
    id: 3,
    nome: "Jovem Gado",
    tipoRaca: "Jersey",
    sexo: "Macho",
    composicaoRacial: "Mestiço",
    dataNascimento: "2023-01-20T00:00:00Z",
    peso: 250,
    idFazenda: 1,
  },
];

export default function ListarAnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimais(MOCK_ANIMALS);
      setLoading(false);
      setError(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id: number) => {
    console.log(`[FRONT-END TESTE] Editar animal com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`[FRONT-END TESTE] Deletar animal com ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-700">Carregando animais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 text-gray-800 p-8">
      {/* Container do cabeçalho da tabela */}
      <div className="flex justify-start w-full max-w-4xl mb-4">
        <h1
          className={`${tsukimi.className} text-3xl font-semibold text-red-900`}
        >
          Listar Animais
        </h1>
      </div>

      {/* Card principal com a tabela */}
      <Card className="w-full max-w-4xl rounded-2xl shadow-lg border-red-900/20">
        <CardContent className="p-4">
          <div className="w-full overflow-hidden rounded-md border border-red-900/20">
            <Table>
              <TableHeader className="bg-red-700/10">
                <TableRow className="border-b border-red-900/20">
                  <TableHead className="font-bold text-red-900 w-[150px] p-3">
                    Nome
                  </TableHead>
                  <TableHead className="font-bold text-red-900 p-3">
                    Raça
                  </TableHead>
                  <TableHead className="font-bold text-red-900 p-3">
                    Sexo
                  </TableHead>
                  <TableHead className="font-bold text-red-900 p-3">
                    Composição
                  </TableHead>
                  <TableHead className="font-bold text-red-900 p-3">
                    Nascimento
                  </TableHead>
                  <TableHead className="text-center font-bold text-red-900 w-[100px] p-3">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animais.map((animal) => (
                  <TableRow
                    key={animal.id}
                    className="border-b last:border-0 border-red-900/30"
                  >
                    <TableCell className="font-medium text-gray-700 p-3">
                      {animal.nome}
                    </TableCell>
                    <TableCell className="p-3">{animal.tipoRaca}</TableCell>
                    <TableCell className="p-3">{animal.sexo}</TableCell>
                    <TableCell className="p-3">
                      {animal.composicaoRacial || "-"}
                    </TableCell>
                    <TableCell className="p-3">
                      {animal.dataNascimento
                        ? new Date(animal.dataNascimento).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(animal.id)}
                          title="Editar"
                          className="text-stone-500 hover:text-blue-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(animal.id)}
                          title="Excluir"
                          className="text-stone-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {animais.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Nenhum animal encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-start mt-4 pt-4">
            <span className="text-sm opacity-70">
              Total: {animais.length} animal(is)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
