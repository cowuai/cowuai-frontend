"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiCow } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree, PiKeyReturn } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa";

// Importa os componentes do Shadcn UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CadastrarAnimalPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Função para lidar com a mudança nos componentes Select
    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Animal cadastrado:", formData);
        alert("Animal cadastrado com sucesso!");
    };

    if (!mounted) return null;

    return (
        // Conteúdo principal
        <main className="flex-1 p-10 transition-colors duration-500">
            {/* Header (mantido sem alteração) */}
            <header className="flex justify-between items-start mb-8">
                <h1
                    className={`text-3xl font-title mb-6 ${
                        darkMode ? "text-white" : "text-red-900"
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

            {/* Card do formulário Shadcn */}
            <div
                className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${
                    darkMode ? "bg-stone-950" : "bg-white"
                }`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div>
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Digite o nome do animal..."
                            required
                        />
                    </div>

                    {/* Espécie */}
                    <div>
                        <Label htmlFor="especie">Espécie</Label>
                        <Select
                            value={formData.especie}
                            onValueChange={(value) => handleSelectChange("especie", value)}
                            required
                        >
                            <SelectTrigger id="especie">
                                <SelectValue placeholder="Selecione a espécie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bovinos">Bovinos</SelectItem>
                                <SelectItem value="Caprinos">Caprinos</SelectItem>
                                <SelectItem value="Aves">Aves</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Raça */}
                    <div>
                        <Label htmlFor="raca">Raça</Label>
                        <Input
                            type="text"
                            id="raca"
                            name="raca"
                            value={formData.raca}
                            onChange={handleChange}
                            placeholder="Digite a raça..."
                            required
                        />
                    </div>

                    {/* Idade */}
                    <div>
                        <Label htmlFor="idade">Idade (anos)</Label>
                        <Input
                            type="number"
                            id="idade"
                            name="idade"
                            value={formData.idade}
                            onChange={handleChange}
                            required
                            min={0}
                        />
                    </div>

                    {/* Origem */}
                    <div>
                        <Label htmlFor="origem">Origem</Label>
                        <Input
                            type="text"
                            id="origem"
                            name="origem"
                            value={formData.origem}
                            onChange={handleChange}
                            placeholder="Digite a origem..."
                            required
                        />
                    </div>

                    {/* Peso */}
                    <div>
                        <Label htmlFor="peso">Peso (kg)</Label>
                        <Input
                            type="number"
                            id="peso"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            required
                            min={0}
                        />
                    </div>
                    {/* Botão de Salvar */}
                    <Button
                        type="submit"
                        className="w-full md:w-auto !bg-red-triangulo text-white hover:bg-red-700"
                    >
                        Salvar
                    </Button>
                </form>
            </div>
        </main>
    );
}