// src/app/auth/fazenda/cadastrar/page.tsx
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

// ✅ toasts
import { toast } from "sonner";

import { Estado } from "@/types/Estado";
import { Municipio } from "@/types/Municipio";
import { getUFS } from "@/actions/get-ufs";
import { getMunicipios } from "@/actions/get-municipios";

import { apiFetch } from "@/helpers/ApiFetch";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  const { usuario, accessToken } = useAuth();
  

  type FazendaPayload = {
  idProprietario: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  pais: string;
  porte: "PEQUENO" | "MEDIO" | "GRANDE";
  afixo: string;
  prefixo: boolean;
  sufixo: boolean;
};

function toPayload(form: typeof formData, idUsuario?: string | null): FazendaPayload {
  const porte = form.size === 1 ? "PEQUENO" : form.size === 2 ? "MEDIO" : "GRANDE";
  const prefixo = form.affixType === "preffix";
  const sufixo  = form.affixType === "suffix";

  return {
    idProprietario: idUsuario ? Number(idUsuario) : 0, // se 0, back deve validar
    nome: form.farmName,
    endereco: form.address,
    cidade: form.city,
    estado: form.state,
    pais: "Brasil",
    porte,
    afixo: form.affix || "",
    prefixo,
    sufixo,
  };
}


  useEffect(() => setMounted(true), []);
  const darkMode = theme === "dark";

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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (!usuario?.id) {
      // 🔁 trocado de alert() → toast.error()
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    const body = toPayload(formData, usuario.id);

   
const data = await apiFetch(
  `${process.env.NEXT_PUBLIC_API_URL}/fazendas`,
  {
    method: "POST",
    body: JSON.stringify(body),
  },
  accessToken ?? undefined
);


    // sucesso: data deve conter a fazenda criada
    // opcional: redirecionar para a lista
    // router.push("/auth/fazenda/listar");

    // 🔁 trocado de alert() → toast.success()
    toast.success("Fazenda cadastrada com sucesso!");
    console.log("Fazenda criada:", data);
  } catch (err: any) {
    console.error(err);
    // 🔁 trocado de alert() → toast.error()
    toast.error(err?.message ?? "Erro ao cadastrar fazenda");
  }
};

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen transition-colors duration-500 bg-background text-foreground">

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
