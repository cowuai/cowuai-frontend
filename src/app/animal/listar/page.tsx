"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import { Tsukimi_Rounded } from "next/font/google";
import { Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// ======================================================================
// ENUMS (Baseado no seu schema Prisma)
// ======================================================================

type SexoAnimal = "Macho" | "Fêmea";
type StatusAnimal = "VIVO" | "FALECIDO" | "VENDIDO" | "DOADO" | "ROUBADO"; // Usando apenas as chaves do Enum

// ======================================================================
// TIPAGEM
// ======================================================================

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

interface Animal {
  id: number;
  nome: string;
  tipoRaca: string; // TipoRaca do Prisma
  sexo: SexoAnimal; // SexoAnimal do Prisma
  composicaoRacial: string | null;
  dataNascimento: string | null;
  peso: number | null;
  idFazenda: number;
  numeroBrinco: string; // Usado para Brinco/Numero Particular
  dataEntrada: string;
  observacoes: string | null;

  // Campos do Prisma adicionados ou ajustados:
  registro: string | null; // Novo
  status: StatusAnimal; // Novo
  idPai: number | null; // Novo
  idMae: number | null; // Novo
}

type EditableAnimal = Animal;

// ======================================================================
// MOCK DE DADOS (AJUSTADO)
// ======================================================================

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
    numeroBrinco: "BR0001",
    dataEntrada: "2020-05-20T00:00:00Z",
    observacoes: "Animal dócil, primeira cria em 2023.",
    registro: "NL00550", // Novo
    status: "VIVO", // Novo
    idPai: null, // Novo
    idMae: 20, // Novo
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
    numeroBrinco: "BR0002",
    dataEntrada: "2019-12-01T00:00:00Z",
    observacoes: "Reprodutor de alta genética. Necessita manejo cuidadoso.",
    registro: "AN12001", // Novo
    status: "VIVO", // Novo
    idPai: 15, // Novo
    idMae: 25, // Novo
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
    numeroBrinco: "BR0003",
    dataEntrada: "2023-01-20T00:00:00Z",
    observacoes: null,
    registro: null, // Novo
    status: "VENDIDO", // Novo
    idPai: null, // Novo
    idMae: null, // Novo
  },
];

// Helper para formatar a data
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString)
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  } catch {
    return dateString;
  }
};

// Helper para converter data para o formato de input (AAAA-MM-DDTHH:MM)
const formatToLocalISO = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

export default function ListarAnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const [selectedAnimal, setSelectedAnimal] = useState<EditableAnimal | null>(
    null
  );
  const [animalIdToDelete, setAnimalIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimais(MOCK_ANIMALS);
      setLoading(false);
      setError(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveEdit = () => {
    if (!selectedAnimal) return;

    console.log(
      `[BACK-END SIMULAÇÃO] Salvando alterações no animal com ID: ${selectedAnimal.id}`
    );

    setAnimais((prev) =>
      prev.map((a) => (a.id === selectedAnimal.id ? selectedAnimal : a))
    );

    setIsEditModalOpen(false);
    setSelectedAnimal(null);
  };

  const confirmDelete = () => {
    if (!animalIdToDelete) return;

    console.log(
      `[FRONT-END TESTE] Deletando animal com ID: ${animalIdToDelete}`
    );

    setAnimais((prev) => prev.filter((a) => a.id !== animalIdToDelete));

    setAnimalIdToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAnimalIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleView = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsViewModalOpen(true);
  };

  const handleEdit = (animal: Animal) => {
    setSelectedAnimal({ ...animal });
    setIsEditModalOpen(true);
  };

  const handleChange = (field: keyof EditableAnimal, value: any) => {
    if (selectedAnimal) {
      setSelectedAnimal({ ...selectedAnimal, [field]: value });
    }
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
    <div className="flex flex-col justify-start min-h-screen bg-gray-50 text-gray-800 p-8">
      {/* Container do Título - Sem max-w-6xl para que o título use toda a largura e se alinhe à esquerda pelo p-8 */}
      <div className="flex justify-start w-full mb-4">
        <h1
          className={`${tsukimi.className} text-3xl font-semibold text-red-900`}
        >
          Listar Animais
        </h1>
      </div>

      {/* Card principal com a tabela - MANTÉM max-w-6xl e mx-auto para centralizar o bloco da tabela */}
      <Card className="w-full max-w-6xl rounded-2xl shadow-xl border-red-900/20 mx-auto">
        <CardContent className="p-4">
          <div className="w-full overflow-hidden rounded-md border border-red-900/20">
            <Table>
              <TableHeader className="bg-red-700/10 dark:bg-red-950/30">
                <TableRow className="border-b border-red-900/20 hover:bg-transparent">
                  <TableHead className="font-bold text-red-900 w-[100px] p-3">
                    Brinco
                  </TableHead>
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
                    Peso (Kg)
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
                {animais.map((animal, index) => (
                  <TableRow
                    key={animal.id}
                    // Estilo zebrado (odd: ímpar, even: par)
                    className="border-b last:border-0 border-red-900/30 odd:bg-white even:bg-red-50/50 hover:bg-red-100/60 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-700 p-3">
                      {animal.numeroBrinco}
                    </TableCell>
                    <TableCell className="font-medium text-gray-700 p-3">
                      {animal.nome}
                    </TableCell>
                    <TableCell className="p-3">{animal.tipoRaca}</TableCell>
                    <TableCell className="p-3">{animal.sexo}</TableCell>
                    <TableCell className="p-3">
                      {animal.peso ? animal.peso.toFixed(0) : "-"}
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
                        {/* Botão de Visualização (Olho) - AGORA EM CINZA ESCURO */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(animal)}
                          title="Visualizar Detalhes"
                          className="text-stone-500 hover:text-blue-700"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(animal)}
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
                      colSpan={7}
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

      {/* ====================================================================== */}
      {/* MODAL 1: VISUALIZAÇÃO (READ-ONLY) */}
      {/* ====================================================================== */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent
          className="max-w-xl w-[90vw] bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden" // CLASSE ADICIONADA: [&>button]:hidden
        >
          <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
            <DialogTitle
              className={`${tsukimi.className} text-xl font-semibold text-red-800`}
            >
              Visualizar animal
            </DialogTitle>

            {/* Ícone X manual e estilizado */}
            <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
              <X className="h-5 w-5 text-red-900" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>

          {selectedAnimal && (
            <div className="p-6 grid gap-4 max-h-[70vh] overflow-y-auto">
              {/* Linha 1: ID e Brinco */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    ID
                  </label>
                  {/* Campos BLOQUEADOS para visualização */}
                  <Input
                    disabled
                    value={selectedAnimal.id}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Número do Brinco
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.numeroBrinco}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 1.5: Registro e Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Registro
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.registro || "-"}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Status
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.status}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 2: Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Nome do Animal
                </label>
                <Input
                  disabled
                  value={selectedAnimal.nome}
                  className="bg-red-50/80 border-red-900/20 text-gray-700"
                />
              </div>

              {/* Linha 3: Raça e Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Raça
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.tipoRaca}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Sexo
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.sexo}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 4: Composição Racial e Peso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Composição Racial
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.composicaoRacial || "-"}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Peso (Kg)
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.peso ? `${selectedAnimal.peso}` : "-"}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 4.5: Pais e Fazenda */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    ID Mãe
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.idMae || "-"}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    ID Pai
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.idPai || "-"}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    ID Fazenda
                  </label>
                  <Input
                    disabled
                    value={selectedAnimal.idFazenda}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 5: Data Nascimento e Data Entrada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Data de Nascimento
                  </label>
                  <Input
                    disabled
                    value={formatDate(selectedAnimal.dataNascimento)}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Data de Entrada na Fazenda
                  </label>
                  <Input
                    disabled
                    value={formatDate(selectedAnimal.dataEntrada)}
                    className="bg-red-50/80 border-red-900/20 text-gray-700"
                  />
                </div>
              </div>

              {/* Linha 6: Observações (campo longo) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Observações
                </label>
                <Input
                  disabled
                  value={selectedAnimal.observacoes || "-"}
                  className="bg-red-50/80 border-red-900/20 text-gray-700 h-16"
                />
              </div>
            </div>
          )}

          {/* Rodapé com botão Fechar */}
          <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 rounded-md text-red-900 border-3 border-red-900 bg-transparent hover:bg-red-50/50"
              >
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================================================================== */}
      {/* MODAL 2: EDIÇÃO (EDITÁVEL) */}
      {/* ====================================================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className="max-w-xl w-[90vw] bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden" // CLASSE ADICIONADA: [&>button]:hidden
        >
          <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
            <DialogTitle
              className={`${tsukimi.className} text-xl font-semibold text-red-800`}
            >
              Editar animal
            </DialogTitle>

            {/* Ícone X manual e estilizado (Fecha o modal) */}
            <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
              <X className="h-5 w-5 text-red-900" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>

          {selectedAnimal && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="p-6 grid gap-4 max-h-[70vh] overflow-y-auto">
                {/* Linha 1: ID e Brinco */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      ID
                    </label>
                    {/* ID BLOQUEADO */}
                    <Input
                      disabled
                      value={selectedAnimal.id}
                      className="bg-red-50/80 border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Número do Brinco
                    </label>
                    {/* Brinco EDITÁVEL */}
                    <Input
                      value={selectedAnimal.numeroBrinco}
                      onChange={(e) =>
                        handleChange("numeroBrinco", e.target.value)
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                </div>

                {/* Linha 1.5: Registro e Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Registro
                    </label>
                    {/* Registro EDITÁVEL */}
                    <Input
                      value={selectedAnimal.registro || ""}
                      onChange={(e) => handleChange("registro", e.target.value)}
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Status
                    </label>
                    {/* Status EDITÁVEL (usando Select/Enum) */}
                    <select
                      value={selectedAnimal.status}
                      onChange={(e) =>
                        handleChange("status", e.target.value as StatusAnimal)
                      }
                      className="border rounded-md p-2 text-gray-700 border-red-900/20 bg-white"
                    >
                      {/* Mapeando os valores do Enum StatusAnimal */}
                      {["VIVO", "FALECIDO", "VENDIDO", "DOADO", "ROUBADO"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Linha 2: Nome */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Nome do Animal
                  </label>
                  {/* Nome EDITÁVEL */}
                  <Input
                    value={selectedAnimal.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    className="border-red-900/20 text-gray-700"
                  />
                </div>

                {/* Linha 3: Raça e Sexo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Raça
                    </label>
                    {/* Raça EDITÁVEL */}
                    <Input
                      value={selectedAnimal.tipoRaca}
                      onChange={(e) => handleChange("tipoRaca", e.target.value)}
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Sexo
                    </label>
                    {/* Sexo EDITÁVEL (usando Select/Enum) */}
                    <select
                      value={selectedAnimal.sexo}
                      onChange={(e) =>
                        handleChange("sexo", e.target.value as SexoAnimal)
                      }
                      className="border rounded-md p-2 text-gray-700 border-red-900/20 bg-white"
                    >
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </div>
                </div>

                {/* Linha 4: Composição Racial e Peso */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Composição Racial
                    </label>
                    {/* Composição Racial EDITÁVEL */}
                    <Input
                      value={selectedAnimal.composicaoRacial || ""}
                      onChange={(e) =>
                        handleChange("composicaoRacial", e.target.value)
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Peso (Kg)
                    </label>
                    {/* Peso EDITÁVEL */}
                    <Input
                      type="number"
                      value={selectedAnimal.peso || 0}
                      onChange={(e) =>
                        handleChange("peso", Number(e.target.value))
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                </div>

                {/* Linha 4.5: Pais e Fazenda */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      ID Mãe
                    </label>
                    {/* ID Mãe EDITÁVEL */}
                    <Input
                      type="number"
                      value={selectedAnimal.idMae || ""}
                      onChange={(e) =>
                        handleChange(
                          "idMae",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      ID Pai
                    </label>
                    {/* ID Pai EDITÁVEL */}
                    <Input
                      type="number"
                      value={selectedAnimal.idPai || ""}
                      onChange={(e) =>
                        handleChange(
                          "idPai",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      ID Fazenda
                    </label>
                    {/* ID Fazenda EDITÁVEL (Chave Estrangeira importante) */}
                    <Input
                      type="number"
                      value={selectedAnimal.idFazenda}
                      onChange={(e) =>
                        handleChange("idFazenda", Number(e.target.value))
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                </div>

                {/* Linha 5: Data Nascimento e Data Entrada */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Data de Nascimento
                    </label>
                    {/* Data Nascimento EDITÁVEL */}
                    <Input
                      type="datetime-local"
                      value={formatToLocalISO(selectedAnimal.dataNascimento)}
                      onChange={(e) =>
                        handleChange("dataNascimento", e.target.value)
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Data de Entrada na Fazenda
                    </label>
                    {/* Data Entrada EDITÁVEL */}
                    <Input
                      type="datetime-local"
                      value={formatToLocalISO(selectedAnimal.dataEntrada)}
                      onChange={(e) =>
                        handleChange("dataEntrada", e.target.value)
                      }
                      className="border-red-900/20 text-gray-700"
                    />
                  </div>
                </div>

                {/* Linha 6: Observações (campo longo) */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Observações
                  </label>
                  {/* Observações EDITÁVEIS */}
                  {/* Usando <textarea> para campo longo, mas o Input padrão simula o estilo */}
                  <Input
                    value={selectedAnimal.observacoes || ""}
                    onChange={(e) =>
                      handleChange("observacoes", e.target.value)
                    }
                    className="border-red-900/20 text-gray-700 h-16"
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-4 py-2 rounded-md text-red-900 border-3 border-red-900 bg-transparent hover:bg-red-50/50"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-900 text-white hover:bg-red-800"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ====================================================================== */}
      {/* MODAL 3: CONFIRMAÇÃO DE EXCLUSÃO (NOVO) */}
      {/* ====================================================================== */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden">
          <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
            <DialogTitle
              className={`${tsukimi.className} text-xl font-semibold text-red-800`}
            >
              Confirmar Exclusão
            </DialogTitle>
            {/* Ícone X manual e estilizado (Fecha o modal) */}
            <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
              <X className="h-5 w-5 text-red-900" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>

          <div className="p-6">
            <p className="text-gray-700 text-base">
              Você tem certeza que deseja excluir permanentemente o animal com
              ID:
              <span className="font-bold text-red-900 ml-1">
                {animalIdToDelete}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
          </div>

          <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 rounded-md text-gray-700 border-gray-400 bg-transparent hover:bg-gray-100"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
