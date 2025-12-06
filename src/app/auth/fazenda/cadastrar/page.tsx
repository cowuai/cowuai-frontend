// src/app/auth/fazenda/cadastrar/page.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

// ✅ toasts
import { toast } from "sonner";

import { Estado } from "@/types/Estado";
import { Municipio } from "@/types/Municipio";
import { getUfs as getUFS } from "@/actions/getUfs";
import { getMunicipios } from "@/actions/getMunicipios";

import { apiFetch } from "@/helpers/ApiFetch";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { fazendaScheme } from "@/zodSchemes/fazendaScheme";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type FarmForm = {
    farmName: string;
    address: string;
    state: string;
    city: string;
    size: 1 | 2 | 3;
    affix: string;
    affixType: "" | "preffix" | "suffix";
};

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
        const sufixo = form.affixType === "suffix";

        return {
            idProprietario: idUsuario ? Number(idUsuario) : 0, // se 0, back deve validar
            nome: form.farmName,
            endereco: form.address,
            cidade: form.city,
            estado: form.state,
            pais: "Brasil",
            porte,
            afixo: form.affix,
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

    }, [formData.state]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!usuario?.id) {
            toast.error("Sessão expirada. Faça login novamente.");
            return;
        }

        try {
            const rawBody = toPayload(formData, usuario.id);

            // valida com Zod (front)
            const body = fazendaScheme.parse(rawBody);

            const data = await apiFetch(
                `${process.env.NEXT_PUBLIC_API_URL}/fazendas`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                },
                accessToken ?? undefined
            );

            router.push("/auth/fazenda/listar");
            toast.success("Fazenda cadastrada com sucesso!");
            console.log("Fazenda criada:", data);
        } catch (err) {
            if (err instanceof z.ZodError) {
                // ⬇️ aqui muda de `errors` para `issues` e tipamos o issue
                err.issues.forEach((issue: z.ZodIssue) => {
                    toast.error(issue.message);
                });
                return;
            }

            console.error(err);
            const anyErr = err as any;
            toast.error(anyErr?.message ?? "Erro ao cadastrar fazenda");
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex max-w-7xl mx-auto py-8 px-4">
            {/* Conteúdo principal */}
            <main className="flex-1 transition-colors duration-500">
                {/* Header */}
                <header className="flex-row justify-between items-start mb-8">
                    <Link href="/auth/fazenda/listar"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para fazendas
                    </Link>
                    <h1 className={`text-3xl font-title mb-2 ${darkMode ? "text-white" : "text-red-900"}`}>
                        Cadastrar Fazenda
                    </h1>
                    <BreadcrumbArea />
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
             placeholder:text-gray-300 dark:placeholder:text-gray-300"
                                placeholder="Rua, número, complemento…"
                                required
                            />
                        </div>

                        {/* UF + Cidade */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ESTADO (UF) */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Estado (UF)
                                </label>

                                <Select
                                    // o Select usa value + onValueChange em vez de event.target
                                    value={formData.state}
                                    onValueChange={(value) =>
                                        handleChange({
                                            target: { name: "state", value },
                                        } as any)
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded-md p-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300">
                                        <SelectValue placeholder="Selecione a UF" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {estados.map((e) => (
                                            <SelectItem key={e.id} value={e.sigla}>
                                                {e.nome} ({e.sigla})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* CIDADE */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Cidade
                                </label>

                                <Select
                                    value={formData.city}
                                    onValueChange={(value) =>
                                        handleChange({
                                            target: { name: "city", value },
                                        } as any)
                                    }
                                    disabled={municipios.length === 0}
                                >
                                    <SelectTrigger className="w-full border rounded-md p-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300">
                                        <SelectValue
                                            placeholder={
                                                municipios.length === 0
                                                    ? "Selecione a UF primeiro"
                                                    : "Selecione a cidade"
                                            }
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {municipios.map((m) => (
                                            <SelectItem key={m.id} value={m.nome}>
                                                {m.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    Afixo
                                </label>
                                <input
                                    type="text"
                                    name="affix"
                                    value={formData.affix}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md p-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                    placeholder="Ex.: Boa Esperança"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tipo de Afixo
                                </label>

                                <Select
                                    value={formData.affixType}
                                    onValueChange={(value) =>
                                        handleChange({
                                            target: { name: "affixType", value },
                                        } as any)
                                    }
                                >
                                    <SelectTrigger className="w-full border rounded-md p-2 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300">
                                        <SelectValue placeholder="Selecione o tipo de afixo" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {/* Se quiser permitir “nenhum”, pode descomentar isso */}
                                        {/* <SelectItem value="">— Nenhum —</SelectItem> */}
                                        <SelectItem value="preffix">Prefixo</SelectItem>
                                        <SelectItem value="suffix">Sufixo</SelectItem>
                                    </SelectContent>
                                </Select>
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