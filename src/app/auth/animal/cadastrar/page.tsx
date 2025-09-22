"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiCow } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree, PiKeyReturn } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa";

export default function CadastrarAnimalPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    //estado que armazena os dados digitados no formulário de cadastroopo
    const [formData, setFormData] = useState({
        nome: "",
        especie: "",
        raca: "",
        idade: "",
        origem: "",
        peso: "",
    });

    useEffect(() => setMounted(true), []);

    const darkMode = theme === "dark";
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Animal cadastrado:", formData);
        alert("Animal cadastrado com sucesso!");
    };

    if (!mounted) return null;

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
                        <details className="group mt-2">
                            <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <PiUsersThree size={20} className="text-red-600" />
                                {sidebarOpen && <span>Gerenciar Fazendas</span>}
                                <FaChevronRight className="transition-transform duration-300 group-open:rotate-90 text-red-600" />
                            </summary>

                            {sidebarOpen && (
                                <ul className="mt-2 space-y-1 text-md bg-sidebar text-sidebar-foreground rounded-md p-2">
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Cadastrar Fazenda</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Atualizar Fazenda</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Excluir Fazenda</Link>
                                    </li>
                                    <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Link href="#">Visualizar Fazenda</Link>
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
                        className={`text-3xl font-title mb-6 ${darkMode ? "text-white" : "text-red-900"
                            }`}
                    >
                        Cadastrar Animal
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
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

                {/* Formulário */}
                <div
                    className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${darkMode ? "bg-stone-950" : "bg-white"
                        }`}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Espécie</label>
                            <select
                                name="especie"
                                value={formData.especie}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                            >
                                <option value="">Selecione a espécie</option>
                                <option value="Bovinos">Bovinos</option>
                                <option value="Caprinos">Caprinos</option>
                                <option value="Aves">Aves</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium mb-1">Raça</label>
                            <input
                                type="text"
                                name="raca"
                                value={formData.raca}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Idade (anos)</label>
                            <input
                                type="number"
                                name="idade"
                                value={formData.idade}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                                min={0}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Origem</label>
                            <input
                                type="text"
                                name="origem"
                                value={formData.origem}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                            <input
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 text-black"
                                required
                                min={0}
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-900 text-white rounded-md hover:bg-red-700"
                        >
                            Salvar
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}
