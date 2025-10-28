"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {useAuth} from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ==========================
// Enums e Tipos
// ==========================
enum TipoRaca {
  NELORE = "NELORE",
  GIR = "GIR",
  GIROLANDO = "GIROLANDO",
  BRAHMAN = "BRAHMAN",
  GUZERATE = "GUZERÁ",
  SINDI = "SINDI",
  ANGUS = "ANGUS",
  BRANGUS = "BRANGUS",
  LIMOUSIN = "LIMOUSIN",
  CHIANINA = "CHIANINA",
  DEVON = "DEVON",
  BELGIANBLUE = "BELGIAN BLUE",
  HEREFORD = "HEREFORD",
  CANCHIM = "CANCHIM",
  TABAPUA = "TABAPUÃ",
  CARACU = "CARACU",
  SENEPOL = "SENEPOL",
  CHAROLAISE = "CHAROLÊS",
  INDUBRASIL = "INDUBRASIL",
  WAGYU = "WAGYU",
  SIMMENTAL = "SIMMENTAL",
  CRIOULO = "CRIOULO",
  JERSEY = "JERSEY",
  HOLANDES = "HOLANDÊS",
  MURRAH = "MURRAH",
  MESTICO = "MESTIÇO",
  OUTROS = "OUTROS",
}

enum SexoAnimal {
  MACHO = "MACHO",
  FEMEA = "FEMEA",
  INDETERMINADO = "INDETERMINADO",
}

enum StatusAnimal {
  VIVO = "VIVO",
  FALECIDO = "FALECIDO",
  VENDIDO = "VENDIDO",
  DOADO = "DOADO",
  ROUBADO = "ROUBADO",
}

type AnimalForm = {
  nome: string;
  tipoRaca: TipoRaca | "";
  sexo: SexoAnimal | "";
  composicaoRacial: string;
  dataNascimento: string;
  numeroParticularProprietario: string;
  registro: string;
  status: StatusAnimal;
  peso: string;
  idPai: string;
  idMae: string;
  idFazenda: string;
  // escolha se vai usar o afixo da fazenda como prefixo OU sufixo
  affixType?: "" | "prefix" | "suffix";
  localizacao?: string;
};

type AnimalPayload = {
  nome: string;
  tipoRaca: TipoRaca;
  sexo: SexoAnimal;
  composicaoRacial: string | null;
  dataNascimento: Date | null;
  numeroParticularProprietario: string | null;
  registro: string | null;
  status: StatusAnimal;
  peso: number | null;
  idPai: number | null;
  idMae: number | null;
  idProprietario: number;
  idFazenda: number;
  localizacao: string | null;
};

// ==========================
// COMPONENTE PRINCIPAL
// ==========================
export default function CadastrarAnimalPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fazendasDoProprietario, setFazendasDoProprietario] = useState<
    { id: number; nome: string }[]
  >([]);

  const router = useRouter();
  const { usuario, accessToken } = useAuth();

  // Fallbacks (apenas para evitar crash visual; chamadas reais exigem token/ID válidos)
  const usuarioAtivo = usuario ?? { id: 0, nome: "Usuário" };
  const tokenAtivo = accessToken ?? "";

  const [formData, setFormData] = useState<AnimalForm>({
    nome: "",
    tipoRaca: "",
    sexo: "",
    composicaoRacial: "",
    dataNascimento: "",
    numeroParticularProprietario: "",
    registro: "",
    status: StatusAnimal.VIVO,
    peso: "",
    idPai: "",
    idMae: "",
    idFazenda: "",
    affixType: "",
    localizacao: "",
  });

  // Afixo da fazenda selecionada (buscado quando o idFazenda muda)
  const [fazendaAfixo, setFazendaAfixo] = useState<{
    afixo: string | null;
    prefixo: boolean;
    sufixo: boolean;
  } | null>(null);

  useEffect(() => setMounted(true), []);
  const darkMode = theme === "dark";

  // ==========================
  // Carregar fazendas do proprietário
  // ==========================
  useEffect(() => {
    const carregarFazendas = async () => {
      if (!usuarioAtivo?.id || !tokenAtivo) {
        setFazendasDoProprietario([]);
        return;
      }

      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const resF = await fetch(
          `${base}/fazendas/proprietario/${usuarioAtivo.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenAtivo}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!resF.ok) throw new Error(`HTTP ${resF.status}`);
        const fazendas: { id: number; nome: string }[] = await resF.json();

        setFazendasDoProprietario(fazendas);

        if (fazendas.length > 0) {
          setFormData((prev) => ({
            ...prev,
            idFazenda: String(fazendas[0].id),
          }));
        }
      } catch (err: any) {
        console.error("Erro ao carregar fazendas:", err);
        toast.error("Erro ao carregar fazendas do proprietário.");
      }
    };

    carregarFazendas();
  }, [usuarioAtivo?.id, tokenAtivo]);

  // ==========================
  // Funções de formulário
  // ==========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Gera o nome completo do animal, aplicando o afixo da fazenda se necessário
  const getFullName = () => {
    const n = formData.nome?.trim() || "";
    const afixo = fazendaAfixo?.afixo?.trim() || "";

    // Se o usuário escolheu usar afixo como prefixo ou sufixo, aplica-o.
    if (formData.affixType === "prefix" && afixo) {
      return `${afixo} ${n}`.trim();
    }
    if (formData.affixType === "suffix" && afixo) {
      return `${n} ${afixo}`.trim();
    }

    // Retorna somente o nome
    return n;
  };

  // Quando o usuário seleciona uma fazenda, buscar o afixo (prefixo/sufixo)
  useEffect(() => {
    const fetchFazenda = async () => {
      const id = formData.idFazenda;
      if (!id) {
        setFazendaAfixo(null);
        return;
      }

      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const res = await fetch(`${base}/fazendas/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenAtivo}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Espera-se que a API retorne { prefixo, sufixo }
        setFazendaAfixo({
          afixo: data?.afixo ?? null,
          prefixo: Boolean(data?.prefixo),
          sufixo: Boolean(data?.sufixo),
        });
      } catch (err) {
        console.error("Erro ao carregar afixo da fazenda:", err);
        setFazendaAfixo(null);
      }
    };

    fetchFazenda();
  }, [formData.idFazenda, tokenAtivo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.idFazenda) {
        toast.error("Selecione uma fazenda antes de salvar.");
        return;
      }
      if (!usuarioAtivo?.id || !tokenAtivo) {
        toast.error("Sessão inválida. Faça login novamente.");
        return;
      }

      const payload: AnimalPayload = {
        nome: getFullName() || formData.nome,
        tipoRaca: formData.tipoRaca as TipoRaca,
        sexo: formData.sexo as SexoAnimal,
        composicaoRacial: formData.composicaoRacial || null,
        dataNascimento: formData.dataNascimento
          ? new Date(formData.dataNascimento)
          : null,
        numeroParticularProprietario:
          formData.numeroParticularProprietario || null,
        registro: formData.registro || null,
        status: formData.status,
        // trata vírgula para Windows/pt-BR
        peso: formData.peso
          ? parseFloat(formData.peso.replace(",", "."))
          : null,
        idPai: formData.idPai ? parseInt(formData.idPai) : null,
        idMae: formData.idMae ? parseInt(formData.idMae) : null,
        idProprietario: Number(usuarioAtivo.id),
        idFazenda: parseInt(formData.idFazenda),
        localizacao: formData.localizacao || null,
      };

      console.log("Payload enviado:", payload);

      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${base}/animais`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenAtivo}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }

      toast.success("Animal cadastrado com sucesso!");

      // Resetar formulário (mantém primeira fazenda selecionada, se houver)
      setFormData({
        nome: "",
        tipoRaca: "",
        sexo: "",
        composicaoRacial: "",
        dataNascimento: "",
        numeroParticularProprietario: "",
        registro: "",
        status: StatusAnimal.VIVO,
        peso: "",
        idPai: "",
        idMae: "",
        idFazenda: fazendasDoProprietario[0]?.id
          ? String(fazendasDoProprietario[0].id)
          : "",
        affixType: "",
        localizacao: "",
      });

      // Opcional: redirecionar para listar animais
      // router.push("/auth/animal/listar");
    } catch (err: any) {
      console.error("Erro ao cadastrar animal:", err);
      toast.error(err?.message || "Erro ao cadastrar animal.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  // ==========================
  // RENDERIZAÇÃO
  // ==========================
  return (
    <div className="flex min-h-screen transition-colors duration-500 bg-background text-foreground">
      <main className="flex-1 p-10 transition-colors duration-500">
        <header className="flex justify-between items-start mb-8">
          <h1
            className={`text-3xl font-title mb-6 ${
              darkMode ? "text-white" : "text-red-900"
            }`}
          >
            Cadastrar Animal
          </h1>
        </header>

        <div
          className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${
            darkMode ? "bg-stone-950" : "bg-white"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                placeholder="Nome do animal"
                required
              />
            </div>

            {/* Tipo Raça */}
            <div>
              <label htmlFor="tipoRaca" className="block text-sm font-medium mb-1">
                Tipo de Raça
              </label>
              <select
                id="tipoRaca"
                name="tipoRaca"
                value={formData.tipoRaca}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                required
              >
                <option value="">Selecione o tipo de raça</option>
                {Object.values(TipoRaca).map((raca) => (
                  <option key={raca} value={raca}>
                    {raca}
                  </option>
                ))}
              </select>
            </div>

            {/* Composição Racial */}
            <div>
            <label
                htmlFor="composicaoRacial"
                className="block text-sm font-medium mb-1"
            >
                Composição Racial
            </label>
            <input
                type="text"
                id="composicaoRacial"
                name="composicaoRacial"
                value={formData.composicaoRacial}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                placeholder="Ex: 1/2 Angus, 1/2 Nelore"
            />
            </div>
            {/* Tipo de Afixo (usar o afixo da fazenda: prefixo OU sufixo) */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Afixo</label>
              <select
                name="affixType"
                value={formData.affixType}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
              >
                <option value="">— Nenhum —</option>
                <option value="prefix">Prefixo (usar afixo da fazenda antes do nome)</option>
                <option value="suffix">Sufixo (usar afixo da fazenda depois do nome)</option>
              </select>

              <p className="text-sm text-gray-600 mt-2">Afixo da fazenda: <span className="font-medium">{fazendaAfixo?.afixo ?? '(nenhum)'}</span></p>
              <p className="text-xs text-gray-500">Obs: o afixo vem cadastrado na fazenda; selecione se quer usá-lo como prefixo ou sufixo.</p>
            </div>

            <div>
              <label htmlFor="numeroParticularProprietario" className="block text-sm font-medium mb-1">Número Particular do Proprietário</label>
              <input
                type="text"
                id="numeroParticularProprietario"
                name="numeroParticularProprietario"
                value={formData.numeroParticularProprietario}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                placeholder="Número fornecido pelo proprietário"
              />
            </div>

            {/* Localização */}
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium mb-1">Localização</label>
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                placeholder="Ex: Pasto 1, Cocho A"
              />
            </div>

            {/* Visualizar nome completo */}
            <div>
              <p className="text-sm text-gray-700">Nome completo: <span className="font-medium">{getFullName() || "(a definir)"}</span></p>
            </div>
            {/* Sexo */}
            <div>
              <label htmlFor="sexo" className="block text-sm font-medium mb-1">
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                required
              >
                <option value="">Selecione o sexo</option>
                {Object.values(SexoAnimal).map((sexo) => (
                  <option key={sexo} value={sexo}>
                    {sexo}
                  </option>
                ))}
              </select>
            </div>

           {/* Fazenda */}
            <div>
            <label htmlFor="idFazenda" className="block text-sm font-medium mb-1">
                Fazenda
            </label>
            <select
                id="idFazenda"
                name="idFazenda"
                value={formData.idFazenda}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                required
            >
                <option value="">
                {fazendasDoProprietario.length === 0
                    ? "Carregando fazendas..."
                    : "Selecione uma fazenda"}
                </option>
                {fazendasDoProprietario.map((fazenda) => (
                <option key={fazenda.id} value={String(fazenda.id)}>
                    {fazenda.nome}
                </option>
                ))}
            </select>

            <p className="text-sm text-gray-600 mt-2">
                Não encontrou a fazenda desejada?{" "}
                <Link
                href="/auth/fazenda/cadastrar"
                className="text-red-700 font-medium hover:underline"
                >
                Cadastre uma nova fazenda
                </Link>
                .
            </p>
            </div>


            {/* Data Nascimento */}
            <div>
              <label
                htmlFor="dataNascimento"
                className="block text-sm font-medium mb-1"
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
              />
            </div>

            {/* Peso */}
            <div>
              <label htmlFor="peso" className="block text-sm font-medium mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-black dark:text-white"
                placeholder="Peso em kg"
                min={0}
                step="0.01"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-red-900 text-white rounded-md hover:bg-red-700"
              disabled={isLoading || fazendasDoProprietario.length === 0}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}