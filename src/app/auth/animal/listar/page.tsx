"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Imports da Tabela
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
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";

// IMPORTS DOS SEUS COMPONENTES REFATORADOS
import { PaginationControls } from "../../../../components/custom/animal/listar/PaginationControls";
import { ConfirmDeleteModal } from "../../../../components/custom/animal/listar/ConfirmDeleteModal";
// ✅ IMPORT DO NOVO MODAL DE EDIÇÃO
import { EditAnimalModal, Animal } from "../../../../components/custom/animal/listar/EditAnimalModal";

// ======================================================================
// CONFIGURAÇÕES GERAIS
// ======================================================================
const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

interface PaginationData {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse {
  data: Animal[];
  pagination: PaginationData;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ANIMAL_ENDPOINT = `${API_BASE_URL}/animais`;

// ======================================================================
// FUNÇÕES FETCH
// ======================================================================
const fetchAnimals = async (
  page: number,
  pageSize: number,
  token: string | null
): Promise<ApiResponse> => {
  const url = `${ANIMAL_ENDPOINT}?page=${page}&pageSize=${pageSize}`;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    credentials: "include",
    headers: headers,
  });

  if (!response.ok) {
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

// ======================================================================
// COMPONENTE PRINCIPAL
// ======================================================================

export default function ListarAnimaisPage() {
  const { accessToken } = useAuth();
  const DEFAULT_PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(DEFAULT_PAGE_SIZE);
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

  // Estados para o Modal de Edição (Adicionados de volta)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  // Estados para o Modal de Exclusão
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [animalIdToDelete, setAnimalIdToDelete] = useState<number | null>(null);

  const router = useRouter();

  // Busca de Dados
  useEffect(() => {
    const loadAnimals = async () => {
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const apiResponse = await fetchAnimals(
          currentPage,
          pageSize,
          accessToken
        );

        if (apiResponse && Array.isArray(apiResponse.data)) {
          setAnimais(apiResponse.data);
          setPaginationData(
            apiResponse.pagination || {
              page: currentPage,
              pageSize: pageSize,
              totalItems: apiResponse.data.length,
              totalPages: 1,
            }
          );
        } else {
          setAnimais([]);
          setPaginationData({
            page: 1,
            pageSize: pageSize,
            totalItems: 0,
            totalPages: 1,
          });
        }
      } catch (err: any) {
        console.error("Erro ao carregar animais:", err);
        setError(err.message || "Falha ao carregar a lista de animais.");
      } finally {
        setLoading(false);
      }
    };
    loadAnimals();
  }, [currentPage, pageSize, refreshFlag, accessToken]);

  const triggerRefresh = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  // ======================================================================
  // LÓGICA DE EDIÇÃO (RESTAURADA E LIMPA)
  // ======================================================================
  const handleEdit = (animal: Animal) => {
    // Abre o modal e define o animal selecionado
    setSelectedAnimal(animal);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedAnimal: Animal) => {
    if (!accessToken) return;

    setLoading(true);
    try {
      // 1. URL correta para atualização (assumindo que sua API usa /animais/{id})
      const url = `${ANIMAL_ENDPOINT}/${updatedAnimal.id}`;

      // 2. Faz a chamada REAL para o backend
      const response = await fetch(url, {
        method: "PUT", // Ou 'PATCH', dependendo da sua API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Importante: Autenticação
        },
        body: JSON.stringify(updatedAnimal),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao atualizar o animal.");
      }

      console.log("Animal atualizado com sucesso:", updatedAnimal);

      // 3. Fecha o modal e recarrega a lista
      setIsEditModalOpen(false);
      setSelectedAnimal(null);
      triggerRefresh(); // Isso vai buscar os dados ATUALIZADOS do backend
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      setError(err.message || "Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================================
  // LÓGICA DE EXCLUSÃO
  // ======================================================================
  const handleDelete = (id: number) => {
    setAnimalIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!animalIdToDelete || !accessToken) return;
    setLoading(true);

    try {
      const url = `${ANIMAL_ENDPOINT}/${animalIdToDelete}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar.");
      }

      if (
        animais.length === 1 &&
        currentPage > 1 &&
        paginationData.totalPages > 1
      ) {
        setCurrentPage((prev) => prev - 1);
      }

      triggerRefresh();
      setAnimalIdToDelete(null);
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (animal: Animal) => {
    router.push(`/auth/animal/visualizar/${animal.id}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto py-8 px-4 flex-col items-start justify-start text-gray-800 p-8">
      <div className="flex-row mb-6">
        <h1 className={`${tsukimi.className} text-3xl text-primary mb-2`}>
          Listar Animais
        </h1>
        <BreadcrumbArea />
      </div>

      <Card className="w-full rounded-2xl shadow-xl mx-auto">
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
                {loading && animais.length === 0 ? (
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
                      className="border-b last:border-0 border-red-900/30 odd:bg-white even:bg-red-50/50 hover:bg-muted/80 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-700 p-3">
                        {animal.numeroParticularProprietario}
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
                            className="text-stone-500 hover:text-blue-700"
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>

                          {/* BOTÃO EDITAR AGORA ABRE O MODAL */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(animal)}
                            className="text-stone-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(animal.id)}
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

          <div className="flex items-center justify-between mt-4 pt-4">
            <span className="text-sm opacity-70">
              Total: {paginationData.totalItems} animal(is)
            </span>
            <PaginationControls
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onConfirm={confirmDelete}
        isLoading={loading}
        tsukimiClassName={tsukimi.className}
      />

      {/* ✅ MODAL DE EDIÇÃO ADICIONADO DE VOLTA */}
      <EditAnimalModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        animalToEdit={selectedAnimal}
        onSave={handleSaveEdit}
        isLoading={loading}
        tsukimiClassName={tsukimi.className}
      />
    </div>
  );
}
