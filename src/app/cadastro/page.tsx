// src/app/cadastro/page.tsx
"use client";

import { z } from "zod"; // ✅ remove 'undefined' do import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Tsukimi_Rounded } from "next/font/google";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Estado } from "@/types/Estado";
import { getUfs } from "@/actions/getUfs";
import { Municipio } from "@/types/Municipio";
import { getMunicipios } from "@/actions/getMunicipios";
import { useRouter } from "next/navigation";

// 🔗 helper de rede (puro, sem hooks dentro)
import { apiFetch } from "@/helpers/ApiFetch";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

// --- helpers de validação (Tipagem corrigida) ---
const onlyDigits = (s: string): string => s.replace(/\D/g, "");

function isValidCPF(cpfRaw: string): boolean {
  const cpf = onlyDigits(cpfRaw);
  if (!/^\d{11}$/.test(cpf)) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais

  // dígitos verificadores
  const calcDigit = (base: string, factorStart: number) => {
    let sum = 0,
      factor = factorStart;
    for (const ch of base) sum += parseInt(ch, 10) * factor--;
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  const d2 = calcDigit(cpf.slice(0, 9) + d1.toString(), 11);
  return cpf.endsWith(`${d1}${d2}`);
}

function isValidBirthDateStr(s: string): boolean {
  // espera "YYYY-MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;

  const today = new Date();
  // não pode ser no futuro
  if (d > today) return false;

  // idade máxima (ex.: 120 anos)
  const oldest = new Date();
  oldest.setFullYear(oldest.getFullYear() - 120);
  if (d < oldest) return false;

  return true;
}

const schema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Confirme a senha"),
    cpf: z
      .string()
      .min(11, "Informe o CPF")
      .refine((v) => isValidCPF(v), "CPF inválido"),
    birthDate: z
      .string()
      .refine((v) => isValidBirthDateStr(v), "Data de nascimento inválida"),
    farmName: z.string().min(3, "Informe o nome da fazenda"),
    address: z.string().min(5, "Informe o endereço"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string().min(2, "Informe o estado"),
    country: z.string().min(5, "Informe o país"),
    size: z.number().min(1, "Informe o porte da fazenda"),
    affix: z.string().max(55, "Informe o afixo da fazenda"),
    affixType: z.enum(["preffix", "suffix"]).nullable(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "As senhas não conferem",
  });

type FormValues = z.infer<typeof schema>;

export default function CadastroPage() {
  const router = useRouter();
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      cpf: "",
      birthDate: "",
      farmName: "",
      address: "",
      city: "",
      state: "",
      country: "Brasil",
      size: 1,
      affix: "",
      affixType: null,
    },

    mode: "onSubmit",
  });

  // 🚜 mapeia size (UI) → porte (API)
  const porteEnum: { [key: number]: "PEQUENO" | "MEDIO" | "GRANDE" } = {
    1: "PEQUENO",
    2: "MEDIO",
    3: "GRANDE",
  };

  async function onSubmit(values: FormValues) {
    try {
      // 1. Montar o corpo da requisição no formato esperado pelo backend
      //    com os dados do usuário no nível principal e os da fazenda em um objeto aninhado.
      const requestBody = {
        // Dados do usuário
        cpf: values.cpf,
        nome: values.name,
        email: values.email,
        senha: values.password,
        dataNascimento: values.birthDate,

        // Objeto aninhado com os dados da fazenda
        fazenda: {
          nome: values.farmName,
          endereco: values.address,
          cidade: values.city,
          estado: values.state,
          pais: values.country,
          porte: porteEnum[values.size],
          afixo: values.affix || "",
          // ✅ backend espera boolean (não null)
          prefixo: values.affixType === "preffix",
          sufixo: values.affixType === "suffix",
        },
      };

      // 2. Fazer a chamada para a rota /api/cadastro
      const API_BASE = process.env.NEXT_PUBLIC_API_URL; // ex.: http://localhost:3333/api
      if (!API_BASE) {
        throw new Error(
          "API base não configurada. Defina NEXT_PUBLIC_API_URL no .env.local"
        );
      }

      // 🔗 CHAMA O BACKEND (sem token; cadastro costuma ser público)
      const data = await apiFetch(
        `${API_BASE}/cadastro`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
        undefined // sem Authorization
      );

      // 3. Checar/usar o retorno
      if (data?.accessToken) {
        try {
          localStorage.setItem("token", data.accessToken);
        } catch {
          /* ignore */
        }
      }

      // 4. Feedback + redirecionar (mantém seu design/comentários)
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login"); // ou "/auth/dashboard", conforme seu fluxo
    } catch (err: any) {
      console.error("Erro no processo de cadastro:", err);
      toast.error(err?.message || "Erro inesperado ao cadastrar!");
    }
  }

  useEffect(() => {
    // carregar lista de estados
    getUfs().then(setEstados).catch(console.error);
  }, []);

  useEffect(() => {
    const uf = form.getValues("state");
    if (uf?.length === 2) {
      getMunicipios(uf).then(setMunicipios).catch(console.error);
    } else {
      setMunicipios([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("state")]);

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (values) => {
              console.log("Submit passou:", values);
              onSubmit(values); // ✅ SPA: não faz POST em /cadastro (Next), só no backend
            },
            (errors) => {
              console.log("Erros:", errors);
            }
          )}
          className="flex flex-col md:flex-row w-full max-w-5xl rounded-lg overflow-hidden shadow-lg bg-card gap-6 md:gap-0"
        >
          <div className="flex items-start justify-center bg-card">
            <Link
              href="/login"
              className="mt-13 ml-6 hover:text-red-900 transition-colors"
            >
              <ArrowLeft className="w-7 h-7" strokeWidth={1} />
            </Link>
          </div>

          {/* Coluna 1: Dados pessoais */}
          <div className="flex-1 bg-card p-6 md:p-8">
            <Card className="w-full max-w-md border-0 shadow-none py-8">
              <CardHeader>
                <CardTitle
                  className={`${tsukimi.className} text-3xl font-semibold text-red-900`}
                >
                  Cadastro
                </CardTitle>
                <CardDescription className="text-[12px]">
                  Preencha os campos para fazer seu cadastro na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">
                          Nome completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900">CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Data de Nascimento */}
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900">
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="border-red-900 focus-visible:ring-0 focus:border-red-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Digite seu e-mail..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua senha..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900">
                          Confirmar senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite novamente sua senha..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Dados da fazenda */}
          <div className="flex-1 p-4 md:p-8">
            <Card className="w-full h-full bg-red-900 text-white flex flex-col border-0 shadow-none p-4 md:p-6">
              <CardHeader>
                <CardTitle
                  className={`${tsukimi.className} text-2xl font-normal text-white items-center justify-center text-center`}
                >
                  Dados da Fazenda
                </CardTitle>
                <CardDescription className="text-[12px] text-white!  text-center">
                  Preencha os campos com os dados da sua fazenda
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="farmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Fazenda</FormLabel>
                      <FormControl>
                        <Input
                          className=" text-white placeholder:text-white/80 focus:border-white"
                          placeholder="Digite o nome da fazenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço / Localidade</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white placeholder:text-white/80 focus:border-white"
                          placeholder="Digite o endereço da fazenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-auto data-placeholder:text-white [&_svg:not([class*='text-'])]:text-white">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estados.map((estado) => (
                              <SelectItem key={estado.id} value={estado.sigla}>
                                {estado.nome} ({estado.sigla})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-auto data-placeholder:text-white [&_svg:not([class*='text-'])]:text-white">
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {municipios.length > 0 ? (
                              municipios.map((m) => (
                                <SelectItem key={m.id} value={m.nome}>
                                  {m.nome}
                                </SelectItem>
                              ))
                            ) : (
                              // placeholder desabilitado para não selecionar nada inválido
                              <SelectItem value="__placeholder" disabled>
                                Selecione o estado primeiro
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel className="text-white">Defina o porte</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 p-4">
                          <span className="text-white/80 text-sm">Pequeno</span>
                          <Slider
                            value={[value ?? 1]} // controla pelo form
                            onValueChange={(v) => onChange(v[0])} // salva como number
                            min={1}
                            max={3}
                            step={1}
                            className="w-full"
                            // as props abaixo são visuais do teu Slider; mantive
                            trackClassName="bg-white/30"
                            rangeClassName="bg-white"
                            thumbClassName="h-4 w-4 border-white bg-red-900"
                          />
                          <span className="text-white/80 text-sm">Grande</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="affix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Afixo da Fazenda</FormLabel>
                      <FormControl>
                        <Input
                          className=" text-white placeholder:text-white/80 focus:border-white"
                          placeholder="Digite o afixo da sua fazenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affixType"
                  render={({ field }) => (
                    <FormItem className="flex justify-between">
                      <FormLabel>Tipo de afixo</FormLabel>
                      <FormControl>
                        <Select
                          // ✅ Radix exige value não vazio em itens. Usamos "none" e mapeamos para null.
                          value={field.value ?? "none"}
                          onValueChange={(v) =>
                            field.onChange(
                              v === "none" ? null : (v as "preffix" | "suffix")
                            )
                          }
                        >
                          <SelectTrigger className="w-auto data-placeholder:text-white [&_svg:not([class*='text-'])]:text-white">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— Nenhum —</SelectItem>
                            <SelectItem value="preffix">Prefixo</SelectItem>
                            <SelectItem value="suffix">Sufixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex-col gap-2 p-6">
                <Button
                  type="submit"
                  className="w-full md:w-1/3 mx-auto border  border-white text-white bg-red-900 hover:bg-red-800 transition-colors flex items-center justify-center"
                >
                  Cadastrar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </main>
  );
}
