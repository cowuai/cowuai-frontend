"use client";

import { useEffect, useState, useMemo } from "react";

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

import { Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// ======================================================================

// ENUMS & TIPAGEM (Mantidas)

// ======================================================================

type SexoAnimal = "Macho" | "Fêmea";

type StatusAnimal = "VIVO" | "FALECIDO" | "VENDIDO" | "DOADO" | "ROUBADO";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],

  weight: ["300", "400", "600"],
});

interface Animal {
  // A tipagem deve refletir exatamente o que o backend retorna para a lista

  id: number; // Supondo que o bigint do Prisma seja retornado como number no JSON

  nome: string;

  tipoRaca: string;

  sexo: SexoAnimal;

  composicaoRacial: string | null;

  dataNascimento: string | null;

  peso: number | null;

  idFazenda: number;

  // Campos extras usados no mock para visualização, ajustar se vierem da API:

  numeroBrinco: string;

  dataEntrada: string;

  observacoes: string | null;

  registro: string | null;

  status: StatusAnimal;

  idPai: number | null;

  idMae: number | null;
}

type EditableAnimal = Animal;

interface PaginationData {
  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;
}

// O resultado da sua API deve ser tipado com o formato que você implementou no Controller

interface ApiResponse {
  data: Animal[];

  pagination: PaginationData;
}

// ======================================================================

// SIMULAÇÃO DE DADOS (Removida e substituída pela chamada FETCH)

// ======================================================================

// URL Base da sua API (ajuste conforme o ambiente)

const API_BASE_URL = "http://localhost:3000";

const ANIMAL_ENDPOINT = `${API_BASE_URL}/api/animais`;

const fetchAnimals = async (
  page: number,

  pageSize: number
): Promise<ApiResponse> => {
  // A rota de listagem de animais deve ser ajustada para a URL correta do seu backend

  const url = `${ANIMAL_ENDPOINT}?page=${page}&pageSize=${pageSize}`; // ATENÇÃO: TOKEN DE AUTENTICAÇÃO // O token não é mais enviado via header, mas sim via cookie do navegador. // const MOCK_AUTH_TOKEN = "seu_token_de_autenticacao_aqui"; // Esta linha se torna desnecessária

  const response = await fetch(url, {
    // ✅ ESSA OPÇÃO É CRUCIAL PARA INCLUIR O COOKIE (refreshToken) NA REQUISIÇÃO

    credentials: "include",

    headers: {
      // ❌ REMOVER 'Authorization': Seu backend lê o token do cookie, não deste header.

      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Lidar com erros de status HTTP (400, 500, etc.)

    const errorData = await response

      .json()

      .catch(() => ({ message: response.statusText }));

    throw new Error(
      `Erro ${response.status}: ${
        errorData.message || "Falha ao buscar dados."
      }`
    );
  }

  return response.json();
};

// Helper functions (Mantidas)

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",

      month: "2-digit",

      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

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

// ======================================================================

// Componente de Paginação Numérica (Usando SHADCN UI)

// ======================================================================

interface PaginationControlsProps {
  currentPage: number;

  totalPages: number;

  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,

  totalPages,

  onPageChange,
}) => {
  // Lógica para gerar os números das páginas (incluindo reticências)

  const renderPageButtons = () => {
    const pages: (number | "...")[] = [];

    const maxButtons = 5;

    if (totalPages <= 1) return null;

    const addPage = (page: number) => {
      if (page > 0 && page <= totalPages && !pages.includes(page)) {
        pages.push(page);
      }
    };

    addPage(1);

    if (totalPages > 1) {
      let start = Math.max(2, currentPage - 1);

      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= Math.ceil(maxButtons / 2)) {
        end = Math.min(totalPages - 1, maxButtons - 1);
      } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
        start = Math.max(2, totalPages - (maxButtons - 2));
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        addPage(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      addPage(totalPages);
    }

    // Remove duplicatas consecutivas de '...'

    let lastValue: number | string | undefined = undefined;

    const finalPages = pages.filter((page) => {
      if (page === "..." && lastValue === "...") return false;

      lastValue = page;

      return true;
    });

    return finalPages.map((page, index) => {
      if (page === "...") {
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const isCurrent = page === currentPage;

      return (
        <PaginationItem key={index}>
          <PaginationLink
            // Propriedade nativa do Shadcn para o estilo ativo

            isActive={isCurrent}
            // Uso o 'href' como string vazia e o 'onClick' para a mudança de estado

            onClick={() => onPageChange(page as number)}
            // CLASSE FORÇADA PARA NEUTRO para o estado ativo

            className={
              isCurrent
                ? "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200"
                : ""
            }
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Botão Anterior (Shadcn) - Texto em Português */}

        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>

        {/* Botões Numéricos e Reticências (Shadcn) */}

        {renderPageButtons()}

        {/* Botão Próximo (Shadcn) - Texto em Português */}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          >
            Próximo
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default function ListarAnimaisPage() {
  const DEFAULT_PAGE_SIZE = 2;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 1,

    pageSize: DEFAULT_PAGE_SIZE,

    totalItems: 0,

    totalPages: 1,
  });

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

  // ======================================================================

  // EFEITO: BUSCA DE DADOS COM PAGINAÇÃO

  // ======================================================================

  useEffect(() => {
    const loadAnimals = async () => {
      setLoading(true);

      setError(null);

      try {
        // *** CHAMA A FUNÇÃO DE FETCH REAL AGORA ***

        const response = await fetchAnimals(currentPage, pageSize);

        setAnimais(response.data);

        setPaginationData(response.pagination);
      } catch (err: any) {
        console.error("Erro ao carregar animais:", err);

        setError(err.message || "Falha ao carregar a lista de animais.");
      } finally {
        setLoading(false);
      }
    };

    // Carrega dados sempre que a página, o tamanho da página OU refreshFlag mudar

    loadAnimals();
  }, [currentPage, pageSize, refreshFlag]);

  // ======================================================================

  // FUNÇÕES CRUD: AGORA DISPARAM O refreshFlag APÓS AÇÃO BEM-SUCEDIDA

  // ======================================================================

  const triggerRefresh = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  const handleSaveEdit = async () => {
    if (!selectedAnimal) return;

    console.log(
      `[INTEGRAÇÃO] Tentando salvar alteração no animal: ${selectedAnimal.id}`
    );

    setLoading(true);

    try {
      // No mundo real, você faria a chamada PUT/PATCH aqui:

      // const url = `${ANIMAL_ENDPOINT}/${selectedAnimal.id}`;

      // const response = await fetch(url, { method: 'PUT', body: JSON.stringify(selectedAnimal), ...headers });

      // SIMULAÇÃO DE SUCESSO:

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Se for bem-sucedido:

      triggerRefresh(); // Força a recarga da listagem paginada

      setIsEditModalOpen(false);

      setSelectedAnimal(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);

      setError("Erro ao salvar alterações do animal.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!animalIdToDelete) return;

    console.log(`[INTEGRAÇÃO] Tentando deletar animal: ${animalIdToDelete}`);

    setLoading(true);

    try {
      // No mundo real, você faria a chamada DELETE aqui:

      // const url = `${ANIMAL_ENDPOINT}/${animalIdToDelete}`;

      // const response = await fetch(url, { method: 'DELETE', ...headers });

      // SIMULAÇÃO DE SUCESSO:

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Se for bem-sucedido:

      triggerRefresh(); // Força a recarga da listagem

      setAnimalIdToDelete(null);

      setIsConfirmModalOpen(false);

      // Lógica para mover para página anterior se a atual ficar vazia

      if (animais.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);

      setError("Erro ao deletar o animal.");
    } finally {
      setLoading(false);
    }
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

  // Funções de Navegação para a Paginação Numérica

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  // ======================================================================

  // Renderização Condicional

  // ======================================================================

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Erro: {error}</p>
      </div>
    );
  }

  // ======================================================================

  // JSX: Renderização da Tabela e Paginação

  // ======================================================================

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1
        className={`${tsukimi.className} text-3xl font-semibold text-red-900 mb-4`}
      >
        Listar Animais
      </h1>

      {/* Card principal com a tabela */}

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
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-red-700"
                    >
                      Carregando animais...
                    </TableCell>
                  </TableRow>
                ) : (
                  animais.map((animal) => (
                    <TableRow
                      key={animal.id}
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
                        {formatDate(animal.dataNascimento)}
                      </TableCell>

                      <TableCell className="text-center p-3">
                        <div className="flex items-center justify-center space-x-2">
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
                  ))
                )}

                {!loading && animais.length === 0 && (
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

          {/* ====================================================================== */}

          {/* Componente de Paginação e Total de Itens - FINAL */}

          {/* ====================================================================== */}

          <div className="flex items-center justify-between mt-4 pt-4">
            {/* Contagem Total (Mantida à Esquerda) */}

            <span className="text-sm opacity-70">
              Total: {paginationData.totalItems} animal(is)
            </span>

            {/* Paginação Numérica Centralizada, AGORA COM SHADCN UI CORRIGIDO */}

            <PaginationControls
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* MODALS (Mantidos) */}

      {/* ====================================================================== */}

      {/* MODAL 1: VISUALIZAÇÃO (READ-ONLY) */}

      {/* ====================================================================== */}

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-xl w-[90vw] bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden">
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
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ====================================================================== */}

      {/* MODAL 3: CONFIRMAÇÃO DE EXCLUSÃO (Mantido) */}

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
