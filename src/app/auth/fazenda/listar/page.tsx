// src/app/auth/fazenda/listar/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tsukimi_Rounded } from "next/font/google";
import { Pencil, Trash2, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// 🔐 Auth + fetch helper (sem hooks dentro)
import { useAuth } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/helpers/api-fetch";

// Fonte do título (igual às outras páginas)
const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

// Tipagem básica da UI (mantendo seu shape com size/affixType)
type Farm = {
  id: string;
  farmName: string;
  address: string;
  state: string;
  city: string;
  size: 1 | 2 | 3;
  affix?: string | null;
  affixType?: "preffix" | "suffix" | null;
  createdAt?: string;
  updatedAt?: string;
};

// Helpers de UI (mantidos)
const sizeLabel = (s: Farm["size"]) =>
  s === 1 ? "Pequena" : s === 2 ? "Média" : "Grande";
const affixTypeLabel = (t: Farm["affixType"]) =>
  t === "preffix" ? "Prefixo" : t === "suffix" ? "Sufixo" : "—";

// ======= 🔁 MAPS BACK ⇄ UI (mantém sua UI, traduz com o back) =======
function porteToSize(porte: "PEQUENO" | "MEDIO" | "GRANDE"): 1 | 2 | 3 {
  return porte === "PEQUENO" ? 1 : porte === "MEDIO" ? 2 : 3;
}
function sizeToPorte(size: 1 | 2 | 3): "PEQUENO" | "MEDIO" | "GRANDE" {
  return size === 1 ? "PEQUENO" : size === 2 ? "MEDIO" : "GRANDE";
}
function affixTypeFromFlags(prefixo?: boolean, sufixo?: boolean): "preffix" | "suffix" | null {
  if (prefixo) return "preffix";
  if (sufixo) return "suffix";
  return null;
}
function flagsFromAffixType(affixType?: "" | "preffix" | "suffix") {
  return {
    prefixo: affixType === "preffix",
    sufixo: affixType === "suffix",
  }
}

// ======= 🔁 SHAPES DO BACK (para mapear com segurança) =======
type FarmApi = {
  id: string | number;
  idProprietario?: string | number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  pais?: string;
  porte: "PEQUENO" | "MEDIO" | "GRANDE";
  afixo?: string | null;
  prefixo?: boolean;
  sufixo?: boolean;
  dataCadastro?: string;
  dataAtualizacao?: string;
};

export default function ListarFazendasPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // 🔐 pega token/usuário do provider (dentro do componente é ok)
  const { accessToken } = useAuth();

  useEffect(() => setMounted(true), []);
  const darkMode = theme === "dark";

  // --- dados vindos da API (substitui o MOCK)
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL; // ex: http://localhost:3333/api

  // 🔁 PAGINAÇÃO — hooks PRECISAM vir antes do early return
  const [page, setPage] = useState(1);
  const pageSize = 5; //Aqui indica quantas linhas por página
  const totalPages = Math.max(1, Math.ceil(farms.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = farms.slice(start, end);
  useEffect(() => {
    setPage(1);
  }, [farms.length]);

  // ======== 🔗 LOAD (GET /fazendas) ========
  async function loadFarms() {
    if (!accessToken) return;
    try {
      setLoading(true);
      setError(null);

      // Obs: o backend pode retornar array puro ou { items: [], total }
      const data = await apiFetch(`${apiBase}/fazendas`, {}, accessToken ?? undefined);
      const list: FarmApi[] = Array.isArray(data) ? data : (data?.items ?? []);

      // mapeia Back → UI (mantendo seu shape)
      const mapped: Farm[] = list.map((b) => ({
        id: String(b.id),
        farmName: b.nome,
        address: b.endereco,
        state: b.estado,
        city: b.cidade,
        size: porteToSize(b.porte),
        affix: b.afixo ?? null,
        affixType: affixTypeFromFlags(b.prefixo, b.sufixo),
        createdAt: b.dataCadastro,
        updatedAt: b.dataAtualizacao,
      }));

      setFarms(mapped);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar fazendas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // carrega ao ter token
    loadFarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  function handleEdit(id: string) {
    router.push(`/auth/fazenda/editar/${id}`);
  }

  // ======== 🗑️ DELETE (DELETE /fazendas/:id) ========
  async function handleDelete(id: string) {
    const ok = window.confirm("Tem certeza que deseja excluir esta fazenda?");
    if (!ok || !accessToken) return;

    try {
      // otimista: remove local
      setFarms((curr) => curr.filter((f) => f.id !== id));
      await apiFetch(`${apiBase}/fazendas/${id}`, { method: "DELETE" }, accessToken ?? undefined);
      // opcional: recarrega do servidor para garantir consistência
      // await loadFarms();
    } catch (e: any) {
      // rollback e aviso
      await loadFarms();
      alert(e?.message ?? "Erro ao excluir");
    }
  }

  // ======== DIALOG DE EDIÇÃO ========
  const [isEditOpen, setIsEditOpen] = useState(false);
  // dialog de visualização
  const [isViewOpen, setIsViewOpen] = useState(false);

  type EditableFarm = {
    id: string;
    farmName: string;
    address: string;
    state: string;
    city: string;
    size: 1 | 2 | 3;
    affix: string;
    affixType: "" | "preffix" | "suffix";
    createdAt?: string;
    updatedAt?: string;
  };

  const [selectedFarm, setSelectedFarm] = useState<EditableFarm | null>(null);

  // ======== 💾 SALVAR EDIÇÃO (PUT /fazendas/:id) ========
  async function saveEdit() {
    if (!selectedFarm || !accessToken) return;

    try {
      // monta payload esperado pelo back (UI → Back)
      const body = {
        nome: selectedFarm.farmName,
        endereco: selectedFarm.address,
        cidade: selectedFarm.city,
        estado: selectedFarm.state,
        porte: sizeToPorte(selectedFarm.size),
        afixo: selectedFarm.affix || "",
        ...flagsFromAffixType(selectedFarm.affixType),
        // se o back exigir pais/idProprietario no update, adicione aqui:
        // pais: "Brasil",
        // idProprietario: <id>,
      };

      await apiFetch(
        `${apiBase}/fazendas/${selectedFarm.id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
        accessToken ?? undefined
      );

      // fecha dialog, recarrega lista para refletir atualização
      setIsEditOpen(false);
      setSelectedFarm(null);
      await loadFarms();
    } catch (e: any) {
      alert(e?.message ?? "Erro ao salvar alterações");
    }
  }

  // ✅ Agora o early return pode vir, depois de TODOS os hooks
  if (!mounted) return null;

  // Sem token → peça login (mantém UX simples)
  if (!accessToken) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold mb-2">Fazendas</h1>
        <p>Faça login para visualizar suas fazendas.</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen transition-colors duration-500 bg-background text-foreground">
      {/* Conteúdo principal */}
      <main className="flex-1 p-10 transition-colors duration-500">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <h1
            className={`${tsukimi.className} text-3xl ${darkMode ? "text-white" : "text-red-900"
              }`}
          >
            Listar Fazendas
          </h1>

          <div className="flex items-center gap-4 mt-1">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-400">
              <Image
                src="/images/user-photo.png"
                alt="Foto do usuário"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Card central com a Tabela */}
        <div
          className={`w-full max-w-6xl mx-auto p-6 md:p-8 rounded-2xl shadow-lg overflow-x-auto ${darkMode ? "bg-stone-950" : "bg-white"
            }`}
        >
          {/* estados de carregamento/erro (simples) */}
          {loading && (
            <div className="mb-4 text-sm opacity-70">Carregando...</div>
          )}
          {error && (
            <div className="mb-4 rounded-md border border-red-400 bg-red-50 text-red-800 p-3">
              {error}
            </div>
          )}

          {/* Tabela (mantendo cores do head/bordas em vermelho) */}
          <div className="w-full overflow-x-auto rounded-md border border-red-900/20">
            <Table>
              <TableHeader className="bg-red-700/10 dark:bg-red-950/30">
                <TableRow className="hover:bg-transparent border-b border-red-900/20">
                  <TableHead className="text-red-900 dark:text-red-300">Nome</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Endereço</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">UF</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Cidade</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Porte</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Afixo</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Tipo de Afixo</TableHead>
                  <TableHead className="text-red-900 dark:text-red-300">Criada em</TableHead>
                  <TableHead className="text-center text-red-900 dark:text-red-300">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageData.map((f) => (
                  <TableRow
                    key={f.id}
                    className="hover:bg-muted/80 border-b last:border-0 border-red-900/30"
                  >
                    <TableCell className="font-medium">
                      {f.farmName}
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      {f.address}
                    </TableCell>
                    <TableCell>{f.state}</TableCell>
                    <TableCell>{f.city}</TableCell>
                    <TableCell>{sizeLabel(f.size)}</TableCell>
                    <TableCell>{f.affix || "—"}</TableCell>
                    <TableCell>{affixTypeLabel(f.affixType)}</TableCell>
                    <TableCell className="text-right">
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleDateString("pt-BR")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Visualizar — abre o Dialog somente leitura */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFarm({
                              id: f.id,
                              farmName: f.farmName,
                              address: f.address,
                              state: f.state,
                              city: f.city,
                              size: f.size,
                              affix: f.affix ?? "",
                              affixType: (f.affixType ?? "") as "" | "preffix" | "suffix",
                              createdAt: f.createdAt,
                              updatedAt: f.updatedAt,
                            });
                            setIsViewOpen(true);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                                    text-stone-500 hover:text-stone-700 hover:bg-stone-300
                                                    dark:text-stone-400 dark:hover:text-red-300 dark:hover:bg-stone-700
                                                    transition-colors"
                          aria-label={`Visualizar ${f.farmName}`}
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Editar — abre o Dialog preenchido */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFarm({
                              id: f.id,
                              farmName: f.farmName,
                              address: f.address,
                              state: f.state,
                              city: f.city,
                              size: f.size,
                              affix: f.affix ?? "",
                              affixType: (f.affixType ?? "") as
                                | ""
                                | "preffix"
                                | "suffix",
                              createdAt: f.createdAt,
                              updatedAt: f.updatedAt,
                            });
                            setIsEditOpen(true);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                                  text-stone-500 hover:text-stone-700 hover:bg-stone-300
                                                  dark:text-stone-400 dark:hover:text-red-300 dark:hover:bg-stone-700
                                                  transition-colors"
                          aria-label={`Editar ${f.farmName}`}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Excluir */}
                        <button
                          type="button"
                          onClick={() => handleDelete(f.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                text-stone-500 hover:text-red-700  hover:bg-stone-300
                                dark:text-stone-400 dark:hover:text-red-400 dark:hover:bg-stone-700
                                transition-colors"
                          aria-label={`Excluir ${f.farmName}`}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {farms.length === 0 && !loading && !error && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      Nenhuma fazenda encontrada.{" "}
                      <Link
                        href="/auth/fazenda/cadastrar"
                        className="text-red-900 hover:underline"
                      >
                        Cadastrar agora
                      </Link>
                      .
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Ações (bottom do card) */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm opacity-70">
              Total: {farms.length} fazenda(s)
            </span>

            <span className="flex items-center text-sm opacity-70 whitespace-nowrap">
              Exibindo {farms.length === 0 ? 0 : start + 1}–{Math.min(end, farms.length)} de {farms.length}
            </span>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
                      dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
                      ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(n);
                      }}
                      aria-current={page === n ? "page" : undefined}
                      className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
                        dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
                        ${page === n ? "border-3" : ""}`}
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
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={`text-stone-500 hover:text-stone-500 hover:bg-stone-100
                      dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-700
                      ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* ======== DIALOG: Visualizar Fazenda (read-only) ======== */}
        <Dialog
          open={isViewOpen}
          onOpenChange={(open) => {
            setIsViewOpen(open);
            if (!open) setSelectedFarm(null);
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="items-center text-center">
              <DialogTitle className={`${tsukimi.className} text-red-900 dark:text-red-500`}>
                Visualizar fazenda
              </DialogTitle>
            </DialogHeader>

            {selectedFarm && (
              <div className="space-y-4">
                {/* ID */}
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">ID</label>
                  <input
                    type="text"
                    value={selectedFarm.id}
                    disabled
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* Nome da Fazenda */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Fazenda</label>
                  <input
                    type="text"
                    value={selectedFarm.farmName}
                    disabled
                    readOnly
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium mb-1">Endereço / Localidade</label>
                  <input
                    type="text"
                    value={selectedFarm.address}
                    disabled
                    readOnly
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* UF + Cidade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      value={selectedFarm.state}
                      disabled
                      readOnly
                      className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <input
                      type="text"
                      value={selectedFarm.city}
                      disabled
                      readOnly
                      className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                    />
                  </div>
                </div>

                {/* Porte */}
                <div>
                  <label className="block text-sm font-medium mb-1">Porte</label>
                  <input
                    type="text"
                    value={sizeLabel(selectedFarm.size)}
                    disabled
                    readOnly
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* Afixo + Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Afixo</label>
                    <input
                      type="text"
                      value={selectedFarm.affix || "—"}
                      disabled
                      readOnly
                      className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Afixo</label>
                    <input
                      type="text"
                      value={affixTypeLabel((selectedFarm.affixType || null) as Farm["affixType"])}
                      disabled
                      readOnly
                      className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                    />
                  </div>
                </div>

                {/* Criada / Atualizada em */}
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">Criada em</label>
                  <input
                    type="text"
                    value={
                      selectedFarm.createdAt
                        ? new Date(selectedFarm.createdAt).toLocaleString("pt-BR")
                        : "—"
                    }
                    disabled
                    readOnly
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">Atualizada em</label>
                  <input
                    type="text"
                    value={
                      selectedFarm.updatedAt
                        ? new Date(selectedFarm.updatedAt).toLocaleString("pt-BR")
                        : "—"
                    }
                    disabled
                    readOnly
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                <DialogFooter className="mt-2">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md text-red-900 border-3 border-red-900 bg-transparent hover:bg-stone-300 dark:hover:bg-stone-800 dark:text-white"
                    >
                      Fechar
                    </button>
                  </DialogClose>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* ======== /DIALOG ======== */}

        {/* ======== DIALOG: Editar Fazenda ======== */}
        <Dialog
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setSelectedFarm(null); // limpa o estado ao fechar
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="items-center text-center">
              <DialogTitle className={`${tsukimi.className} text-red-900 dark:text-red-500`}>
                Editar fazenda
              </DialogTitle>
            </DialogHeader>

            {selectedFarm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // ✅ chama sua API (PUT /fazendas/:id) com selectedFarm
                  saveEdit();
                }}
                className="space-y-4"
              >
                {/* ID (não editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">ID</label>
                  <input
                    type="text"
                    value={selectedFarm.id}
                    disabled
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* Nome da Fazenda (editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Fazenda</label>
                  <input
                    type="text"
                    value={selectedFarm.farmName}
                    onChange={(e) =>
                      setSelectedFarm({ ...selectedFarm, farmName: e.target.value })
                    }
                    className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                    required
                  />
                </div>

                {/* Endereço (editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Endereço / Localidade</label>
                  <input
                    type="text"
                    value={selectedFarm.address}
                    onChange={(e) =>
                      setSelectedFarm({ ...selectedFarm, address: e.target.value })
                    }
                    className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                    required
                  />
                </div>

                {/* UF + Cidade (editáveis) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      value={selectedFarm.state}
                      onChange={(e) =>
                        setSelectedFarm({
                          ...selectedFarm,
                          state: e.target.value.toUpperCase().slice(0, 2),
                        })
                      }
                      className="w-full border rounded-md p-2 text-black dark:text-foreground uppercase bg-white dark:bg-stone-900"
                      placeholder="Ex.: MG"
                      maxLength={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <input
                      type="text"
                      value={selectedFarm.city}
                      onChange={(e) =>
                        setSelectedFarm({ ...selectedFarm, city: e.target.value })
                      }
                      className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                      required
                    />
                  </div>
                </div>

                {/* Porte (editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Porte</label>
                  <select
                    value={selectedFarm.size}
                    onChange={(e) =>
                      setSelectedFarm({
                        ...selectedFarm,
                        size: Number(e.target.value) as 1 | 2 | 3,
                      })
                    }
                    className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                  >
                    <option value={1}>Pequena</option>
                    <option value={2}>Média</option>
                    <option value={3}>Grande</option>
                  </select>
                </div>

                {/* Afixo + Tipo (editáveis) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Afixo (opcional)</label>
                    <input
                      type="text"
                      value={selectedFarm.affix}
                      onChange={(e) =>
                        setSelectedFarm({ ...selectedFarm, affix: e.target.value })
                      }
                      className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                      placeholder="Ex.: Boa Esperança"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Afixo</label>
                    <select
                      value={selectedFarm.affixType}
                      onChange={(e) =>
                        setSelectedFarm({
                          ...selectedFarm,
                          affixType: e.target.value as "" | "preffix" | "suffix",
                        })
                      }
                      className="w-full border rounded-md p-2 text-black dark:text-foreground bg-white dark:bg-stone-900"
                    >
                      <option value="">— Nenhum —</option>
                      <option value="preffix">Prefixo</option>
                      <option value="suffix">Sufixo</option>
                    </select>
                  </div>
                </div>

                {/* Criada em (não editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">Criada em</label>
                  <input
                    type="text"
                    value={
                      selectedFarm.createdAt
                        ? new Date(selectedFarm.createdAt).toLocaleString("pt-BR") // data + hora
                        : "—"
                    }
                    disabled
                    className="w-full border rounded-md p-2 text-black dark:text-foreground   disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                {/* Atualizada em (não editável) */}
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-70">Atualizada em</label>
                  <input
                    type="text"
                    value={
                      selectedFarm.updatedAt
                        ? new Date(selectedFarm.updatedAt).toLocaleString("pt-BR")
                        : "—"
                    }
                    disabled
                    className="w-full border rounded-md p-2 text-black dark:text-foreground disabled:bg-stone-300/80 dark:disabled:bg-stone-900/20"
                  />
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md  text-red-900 border-3 border-red-900 bg-transparent hover:bg-stone-300 dark:hover:bg-stone-800 dark:text-white"
                    >
                      Cancelar
                    </button>
                  </DialogClose>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-red-900 text-white hover:bg-red-800"
                  >
                    Salvar
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        {/* ======== /DIALOG ======== */}
      </main>
    </div>
  );
}
