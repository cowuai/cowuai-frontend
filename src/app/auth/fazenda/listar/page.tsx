// src/app/auth/fazenda/listar/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiCow } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree, PiKeyReturn } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa";
import { Tsukimi_Rounded } from "next/font/google";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Fonte do título (igual às outras páginas)
const tsukimi = Tsukimi_Rounded({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

// Tipagem básica
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
};

// MOCK (trocar por fetch da API depois)
const farmsMock: Farm[] = [
    {
        id: "1",
        farmName: "Fazenda Boa Esperança",
        address: "Estrada km 12",
        state: "MG",
        city: "Uberaba",
        size: 3,
        affix: "Boa Esperança",
        affixType: "preffix",
        createdAt: "2025-09-15",
    },
    {
        id: "2",
        farmName: "Sítio Jatobá",
        address: "Comunidade Jatobá",
        state: "GO",
        city: "Rio Verde",
        size: 2,
        affix: null,
        affixType: null,
        createdAt: "2025-08-03",
    },
    {
        id: "3",
        farmName: "Fazenda Vale Verde",
        address: "BR-262, s/n",
        state: "MS",
        city: "Campo Grande",
        size: 1,
        affix: "Vale Verde",
        affixType: "suffix",
        createdAt: "2025-06-20",
    },
];

const sizeLabel = (s: Farm["size"]) =>
    s === 1 ? "Pequena" : s === 2 ? "Média" : "Grande";
const affixTypeLabel = (t: Farm["affixType"]) =>
    t === "preffix" ? "Prefixo" : t === "suffix" ? "Sufixo" : "—";

export default function ListarFazendasPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => setMounted(true), []);
    const darkMode = theme === "dark";
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (!mounted) return null;

    const farms = farmsMock;

    const router = useRouter();
    function handleEdit(id: string) {
        // Se você ainda não tem a página de edição, isso pode ser um TODO:
        router.push(`/auth/fazenda/editar/${id}`);
    }

    async function handleDelete(id: string) {
        const ok = window.confirm("Tem certeza que deseja excluir esta fazenda?");
        if (!ok) return;

        // TODO: chame sua API de deleção aqui (DELETE /farms/:id)
        console.log("Excluir fazenda:", id);
        // Após deletar, atualize a lista (refetch ou state local)
    }


    return (
        <div className="flex min-h-screen transition-colors duration-500 bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={`flex flex-col justify-between shadow-lg transition-all duration-300 bg-sidebar text-sidebar-foreground ${sidebarOpen ? "w-64 p-6" : "w-20 p-2"
                    }`}
            >
                <div>
                    <div className="flex items-center justify-between mb-10">
                        <Image
                            src="/images/cowuai-logo.png"
                            alt="CowUai Logo"
                            width={sidebarOpen ? 100 : 40}
                            height={sidebarOpen ? 100 : 40}
                        />
                        <PiKeyReturn
                            size={30}
                            className="text-red-600 cursor-pointer"
                            onClick={toggleSidebar}
                            title={sidebarOpen ? "Recolher" : "Expandir"}
                        />
                    </div>

                    {/* Navegação */}
                    <nav className="space-y-2">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-500 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <LuLayoutDashboard size={20} className="text-red-600" />
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>

                        <details className="group">
                            <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <PiCow size={20} className="text-red-600" />
                                {sidebarOpen && <span>Gerenciar Animais</span>}
                                <FaChevronRight className="transition-transform duration-300 group-open:rotate-90 text-red-600" />
                            </summary>

                            {sidebarOpen && (
                                <ul className="mt-2 space-y-1 text-md bg-sidebar text-sidebar-foreground rounded-md p-2">
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="/auth/animal/cadastrar">Cadastrar Animal</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Atualizar Animal</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Excluir Animal</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Visualizar Animal</Link>
                                    </li>
                                </ul>
                            )}
                        </details>

                        <details className="group mt-2" open>
                            <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <PiUsersThree size={20} className="text-red-600" />
                                {sidebarOpen && <span>Gerenciar Fazendas</span>}
                                <FaChevronRight className="transition-transform duration-300 group-open:rotate-90 text-red-600" />
                            </summary>

                            {sidebarOpen && (
                                <ul className="mt-2 space-y-1 text-md bg-sidebar text-sidebar-foreground rounded-md p-2">
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="/auth/fazenda/cadastrar">Cadastrar Fazenda</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="/auth/fazenda/listar">Listar Fazendas</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Atualizar Fazenda</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Excluir Fazenda</Link>
                                    </li>
                                </ul>
                            )}
                        </details>
                    </nav>
                </div>
            </aside>

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

                    {/* Tabela (mantendo cores do head/bordas em vermelho) */}
                    <div className="w-full overflow-x-auto rounded-md border border-red-900">
                        <Table>
                            <TableHeader className="bg-red-700/10 dark:bg-red-950/30">
                                <TableRow className="hover:bg-transparent border-b border-red-900/70">
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
                                {farms.map((f) => (
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
                                                {/* Editar */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(f.id)}
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

                                {farms.length === 0 && (
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
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Editar */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(f.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-md
                                                    text-stone-500 hover:text-stone-700 hover:bg-stone-300
                                                    dark:text-stone-400 dark:hover:text-red-300 dark:hover:bg-stone-900
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
                                                    dark:text-stone-400 dark:hover:text-red-400 dark:hover:bg-stone-900
                                                    transition-colors"
                                                    aria-label={`Excluir ${f.farmName}`}
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

                        <Link
                            href="/auth/fazenda/cadastrar"
                            className="inline-flex items-center justify-center mt-1 h-9 px-4 rounded-md bg-red-900 hover:bg-red-800 text-white text-sm font-medium transition-colors"
                        >
                            Cadastrar fazenda
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
