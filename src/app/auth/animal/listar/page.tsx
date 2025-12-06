"use client";

import {useAuth} from "@/app/providers/AuthProvider";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useTheme} from "next-themes";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {FaEye} from "react-icons/fa";
import {Tsukimi_Rounded} from "next/font/google";
import {Pencil, Trash2} from "lucide-react";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {ConfirmDeleteModal} from "@/components/custom/animal/listar/ConfirmDeleteModal";
import {
    EditAnimalModal,
} from "@/components/custom/animal/listar/EditAnimalModal";
import {toast} from "sonner";
import {Animal} from "@/types/Animal";
import {getAnimalsByIdProprietario} from "@/actions/getAnimalsByIdProprietario";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ANIMAL_ENDPOINT = `${API_BASE_URL}/animais`;

const formatDate = (dateString: string | undefined): string => {
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

export default function ListarAnimaisPage() {
    const {theme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const {accessToken, usuario} = useAuth();

    // Definição de itens por página
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

    // Cálculos para exibição "Exibindo X-Y de Z"
    // No server-side, o cálculo é baseado na página atual e tamanho da página
    const startDisplay = (currentPage - 1) * pageSize;
    const endDisplay = Math.min(
        startDisplay + pageSize,
        paginationData.totalItems
    );

    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [animalIdToDelete, setAnimalIdToDelete] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => setMounted(true), []);
    const darkMode = theme === "dark";

    useEffect(() => {
        const loadAnimals = async () => {
            if (!accessToken) return;
            setLoading(true);
            try {
                const apiResponse = await getAnimalsByIdProprietario(
                    accessToken,
                    usuario?.id.toString() || "",
                    currentPage,
                    pageSize
                );

                // O retorno pode ser Animal[] ou PaginatedAnimals.
                if (Array.isArray(apiResponse)) {
                    // Sem paginação: recebemos diretamente a lista de animais
                    setAnimais(apiResponse);
                    setPaginationData({
                        page: 1,
                        pageSize: pageSize,
                        totalItems: apiResponse.length,
                        totalPages: 1,
                    });
                } else if (apiResponse && "data" in apiResponse && "pagination" in apiResponse) {
                    // Com paginação: atualiza lista e dados de paginação
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
                    // Fallback seguro
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
            } finally {
                setLoading(false);
            }
        };
        loadAnimals();
    }, [currentPage, pageSize, refreshFlag, accessToken, usuario?.id]);

    const triggerRefresh = () => {
        setRefreshFlag((prev) => prev + 1);
    };

    const handleEdit = (animal: Animal) => {
        setSelectedAnimal(animal);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedAnimal: Animal) => {
        if (!accessToken) return;

        setLoading(true);
        try {
            const url = `${ANIMAL_ENDPOINT}/${updatedAnimal.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedAnimal),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro ao atualizar o animal.");
            }

            setIsEditModalOpen(false);
            setSelectedAnimal(null);
            triggerRefresh();
            toast.success("Animal atualizado com sucesso.");
        } catch (err: any) {
            console.error("Erro ao salvar edição:", err);
            toast.error(`Erro ao salvar edição: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

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
            toast.success("Animal deletado com sucesso.");
        } catch (error: any) {
            console.error("Erro ao deletar animal:", error);
            toast.error(`Erro ao deletar animal: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (animal: Animal) => {
        router.push(`/auth/animal/visualizar/${animal.id}`);
    };

    // Esta função não é mais usada diretamente pelo PaginationControls,
    // mas a lógica está embutida nos botões abaixo.
    const goToPage = (page: number) => {
        if (page >= 1 && page <= paginationData.totalPages) {
            setCurrentPage(page);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex max-w-7xl mx-auto py-8 px-4 transition-colors duration-500 text-foreground">
            {/* Conteúdo principal */}
            <main className="flex-1 transition-colors duration-500">
                {/* Header */}
                <header className="flex-row justify-between items-start mb-6">
                    <h1
                        className={`${tsukimi.className} text-3xl mb-2 ${
                            darkMode ? "text-white" : "text-red-900"
                        }`}
                    >
                        Listar Animais
                    </h1>
                    <BreadcrumbArea/>
                </header>

                {/* Card central com a Tabela */}
                <div
                    className={`w-full mx-auto p-6 md:p-8 rounded-2xl shadow-lg overflow-x-auto ${
                        darkMode ? "bg-stone-950" : "bg-white"
                    }`}
                >
                    {/* Wrapper da Tabela com borda externa sutil */}
                    <div className="w-full overflow-x-auto rounded-md border border-red-900/20">
                        <Table>
                            <TableHeader className="bg-red-700/10 dark:bg-red-950/30">
                                <TableRow className="hover:bg-transparent border-b border-red-900/20">
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 w-[100px] p-3">
                                        Brinco
                                    </TableHead>
                                    <TableHead className={"font-bold text-red-900 dark:text-red-300 w-[150px] p-3"}>
                                        Nº Particular do Prop.
                                    </TableHead>
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 w-[150px] p-3">
                                        Nome
                                    </TableHead>
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 p-3">
                                        Raça
                                    </TableHead>
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 p-3">
                                        Sexo
                                    </TableHead>
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 p-3">
                                        Peso (Kg)
                                    </TableHead>
                                    <TableHead className="font-bold text-red-900 dark:text-red-300 p-3">
                                        Nascimento
                                    </TableHead>
                                    <TableHead
                                        className="text-center font-bold text-red-900 dark:text-red-300 w-[100px] p-3">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading && animais.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-8 text-red-700 dark:text-red-400"
                                        >
                                            Carregando animais...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    animais.map((animal) => (
                                        <TableRow
                                            key={animal.id}
                                            className="hover:bg-muted/80 border-b last:border-0 border-red-900/30 transition-colors"
                                        >
                                            <TableCell className="font-medium p-3">
                                                {animal.registro}
                                            </TableCell>
                                            <TableCell className="p-3">{animal.numeroParticularProprietario}</TableCell>
                                            <TableCell className="font-medium p-3">
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

                                            {/* Ações */}
                                            <TableCell className="text-right p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleView(animal)}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                text-stone-500 hover:text-stone-700 hover:bg-stone-300
                                dark:text-stone-400 dark:hover:text-red-300 dark:hover:bg-stone-700
                                transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <FaEye className="w-4 h-4"/>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(animal)}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                text-stone-500 hover:text-stone-700 hover:bg-stone-300
                                dark:text-stone-400 dark:hover:text-red-300 dark:hover:bg-stone-700
                                transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4"/>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(Number(animal.id))}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                text-stone-500 hover:text-red-700 hover:bg-stone-300
                                dark:text-stone-400 dark:hover:text-red-400 dark:hover:bg-stone-700
                                transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                                {!loading && animais.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-8 opacity-70"
                                        >
                                            Nenhum animal encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ========================================================== */}
                    {/* PADRÃO DE PAGINAÇÃO IGUAL AO DA FAZENDA (COM SHADCN DIRETAMENTE) */}
                    {/* ========================================================== */}

                    <div className="flex items-center justify-between mt-1">
            <span className="text-sm opacity-70">
              Total: {paginationData.totalItems} animal(is)
            </span>

                        <span className="flex items-center text-sm opacity-70 whitespace-nowrap">
              Exibindo {paginationData.totalItems === 0 ? 0 : startDisplay + 1}–
                            {endDisplay} de {paginationData.totalItems}
            </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(Math.max(1, currentPage - 1));
                                        }}
                                        className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
                      dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
                      ${
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    />
                                </PaginationItem>

                                {/* Gera os números de página (array simples como na Fazenda) */}
                                {Array.from(
                                    {length: paginationData.totalPages},
                                    (_, i) => i + 1
                                ).map((n) => (
                                    <PaginationItem key={n}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                goToPage(n);
                                            }}
                                            aria-current={currentPage === n ? "page" : undefined}
                                            // Aqui aplicamos a classe condicional para o item ATIVO (vermelho)
                                            className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
        dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
        ${currentPage === n ? "border-2 border-stone-300 font-bold" : ""}`}
                                        >
                                            {n}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(
                                                Math.min(paginationData.totalPages, currentPage + 1)
                                            );
                                        }}
                                        className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
                      dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
                      ${
                                            currentPage === paginationData.totalPages
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>

                {/* Modais */}
                <ConfirmDeleteModal
                    isOpen={isConfirmModalOpen}
                    setIsOpen={setIsConfirmModalOpen}
                    onConfirm={confirmDelete}
                    isLoading={loading}
                    tsukimiClassName={tsukimi.className}
                />

                <EditAnimalModal
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                    animalToEdit={selectedAnimal}
                    onSave={handleSaveEdit}
                    isLoading={loading}
                    tsukimiClassName={tsukimi.className}
                />
            </main>
        </div>
    );
}
