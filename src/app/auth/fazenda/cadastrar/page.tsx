// src/app/fazenda/cadastrar/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiCow } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree, PiKeyReturn } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";

import { Estado } from "@/types/Estado";
import { Municipio } from "@/types/Municipio";
import { getUFS } from "@/actions/get-ufs";
import { getMunicipios } from "@/actions/get-municipios";

type FarmForm = {
  farmName: string;
  address: string;
  state: string;
  city: string;
  size: 1 | 2 | 3;
  affix: string;
  affixType: "" | "preffix" | "suffix";
};

const sizeLabel = (s: 1 | 2 | 3) => (s === 1 ? "Pequena" : s === 2 ? "Média" : "Grande");

export default function CadastrarFazendaPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [formData, setFormData] = useState<FarmForm>({
    farmName: "",
    address: "",
    state: "",
    city: "",
    size: 1,
    affix: "",
    affixType: "",
  });

  useEffect(() => setMounted(true), []);
  const darkMode = theme === "dark";
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Carregar UFs ao montar
  useEffect(() => {
    getUFS().then(setEstados).catch(console.error);
  }, []);

  // Carregar municípios ao trocar UF
  useEffect(() => {
    if (formData.state && formData.state.length === 2) {
      getMunicipios(formData.state).then(setMunicipios).catch(console.error);
      setFormData((prev) => ({ ...prev, city: "" })); // zera cidade ao trocar UF
    } else {
      setMunicipios([]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar para sua API (POST /farms)
    console.log("Fazenda cadastrada:", formData);
    alert("Fazenda cadastrada com sucesso!");
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
            className={`text-3xl font-title mb-6 ${darkMode ? "text-white" : "text-red-900"
              }`}
          >
            Cadastrar Fazenda
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

        {/* Card do formulário (padrão do animal) */}
        <div
          className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${darkMode ? "bg-stone-950" : "bg-white"
            }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome da Fazenda */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome da Fazenda
              </label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                placeholder="Digite o nome da fazenda..."
                required
              />
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Endereço / Localidade
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                placeholder="Rua, número, complemento…"
                required
              />
            </div>

            {/* UF + Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estado (UF)
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  required
                >
                  <option value="">Selecione a UF</option>
                  {estados.map((e) => (
                    <option key={e.id} value={e.sigla}>
                      {e.nome} ({e.sigla})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  required
                  disabled={municipios.length === 0}
                >
                  <option value="">
                    {municipios.length === 0
                      ? "Selecione a UF primeiro"
                      : "Selecione a cidade"}
                  </option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.nome}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Porte - Slider 1..3 */}
            <div>
              <label className="block text-sm font-medium mb-2">Defina o porte</label>

              <div className="flex items-center gap-3">
                <span className="text-sm opacity-80">Pequena</span>

                <Slider
                  value={[formData.size]}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      size: (v[0] as 1 | 2 | 3) ?? 1, // garante o union numérico
                    }))
                  }
                  min={1}
                  max={3}
                  step={1}
                  className="w-full"
                  aria-label="Porte da fazenda"
                />

                <span className="text-sm opacity-80">Grande</span>
              </div>

            </div>

            {/* Afixo + Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Afixo (opcional)
                </label>
                <input
                  type="text"
                  name="affix"
                  value={formData.affix}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  placeholder="Ex.: Boa Esperança"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de Afixo
                </label>
                <select
                  name="affixType"
                  value={formData.affixType}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-black dark:text-white 
             placeholder:text-gray-500 dark:placeholder:text-gray-300"
                >
                  <option value="">— Nenhum —</option>
                  <option value="preffix">Prefixo</option>
                  <option value="suffix">Sufixo</option>
                </select>
              </div>
            </div>

            {/* Botão salvar */}
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
