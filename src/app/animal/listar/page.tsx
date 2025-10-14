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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Componente Input do shadcn/ui

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
  // Campos adicionais que seriam provenientes do schema completo:
  numeroBrinco: string;
  dataEntrada: string;
  observacoes: string | null;
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
    numeroBrinco: "BR0001",
    dataEntrada: "2020-05-20T00:00:00Z",
    observacoes: "Animal dócil, primeira cria em 2023.",
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
  },
];

// Helper para formatar a data
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    try {
        // Formato com data e hora (2-dígitos)
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(",", "");
    } catch {
        return dateString;
    }
};

export default function ListarAnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    // Simulação de carregamento
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

  const handleView = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
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
      <div className="flex justify-start w-full max-w-6xl mb-4">
        <h1
          className={`${tsukimi.className} text-3xl font-semibold text-red-900`}
        >
          Listar Animais
        </h1>
      </div>

      {/* Card principal com a tabela */}
      <Card className="w-full max-w-6xl rounded-2xl shadow-xl border-red-900/20">
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
                    <TableCell className="p-3">{animal.peso ? animal.peso.toFixed(0) : "-"}</TableCell>
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

      {/* Modal de Visualização com estilo de Formulário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* CORREÇÃO: Usando showCloseButton={false} (se implementado) ou removendo-o 
           e confiando que o DialogContent não renderiza o botão se o DialogClose for manual.
           Como a sugestão TS era 'showCloseButton', usaremos 'showCloseButton={false}' se o componente suportar.
           Se não, removeremos o atributo e faremos o estilo no DialogContent.
           Vamos tentar showCloseButton={false} baseado na mensagem de erro. */}
        <DialogContent className="max-w-xl w-[90vw] bg-white rounded-xl p-0 shadow-2xl border-none" showCloseButton={false}>
          
          {/* Header estilizado (similar ao anexo) */}
          <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
            <DialogTitle className={`${tsukimi.className} text-xl font-semibold text-red-800`}>
              Visualizar animal
            </DialogTitle>
             
            {/* Implementação manual do DialogClose (sem a "caixinha" e no local correto). */}
            <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
                <X className="h-5 w-5 text-red-900" />
                <span className="sr-only">Fechar</span>
            </DialogClose>
            
          </DialogHeader>

          {/* Conteúdo com campos de input desabilitados */}
          {selectedAnimal && (
            <div className="p-6 grid gap-4">
              
              {/* Linha 1: ID e Brinco */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">ID</label>
                    <Input disabled value={selectedAnimal.id} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Número do Brinco</label>
                    <Input disabled value={selectedAnimal.numeroBrinco} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
              </div>

              {/* Linha 2: Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Nome do Animal</label>
                <Input disabled value={selectedAnimal.nome} className="bg-red-50/80 border-red-900/20 text-gray-700" />
              </div>

              {/* Linha 3: Raça e Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Raça</label>
                    <Input disabled value={selectedAnimal.tipoRaca} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Sexo</label>
                    <Input disabled value={selectedAnimal.sexo} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
              </div>

              {/* Linha 4: Composição Racial e Peso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Composição Racial</label>
                    <Input disabled value={selectedAnimal.composicaoRacial || "-"} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Peso (Kg)</label>
                    <Input disabled value={selectedAnimal.peso ? `${selectedAnimal.peso}` : "-"} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
              </div>

              {/* Linha 5: Data Nascimento e Data Entrada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Data de Nascimento</label>
                    <Input disabled value={formatDate(selectedAnimal.dataNascimento)} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700">Data de Entrada na Fazenda</label>
                    <Input disabled value={formatDate(selectedAnimal.dataEntrada)} className="bg-red-50/80 border-red-900/20 text-gray-700" />
                </div>
              </div>

              {/* Linha 6: Observações (campo longo) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Observações</label>
                {/* Usando um Input simples aqui para simular o campo */}
                <Input disabled value={selectedAnimal.observacoes || "-"} className="bg-red-50/80 border-red-900/20 text-gray-700 h-16" />
              </div>

            </div>
          )}
          
        </DialogContent>
      </Dialog>
    </div>
  );
}
