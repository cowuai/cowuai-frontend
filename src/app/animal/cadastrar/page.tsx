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
      {/* Conteúdo principal */}
      <main className="flex-1 p-10 transition-colors duration-500">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <h1
            className={`text-3xl font-title mb-6 ${
              darkMode ? "text-white" : "text-red-900"
            }`}
          >
            Cadastrar Animal
          </h1>
        </header>

        {/* Formulário */}
        <div
          className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${
            darkMode ? "bg-stone-950" : "bg-white"
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
              <label className="block text-sm font-medium mb-1">
                Idade (anos)
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Peso (kg)
              </label>
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
