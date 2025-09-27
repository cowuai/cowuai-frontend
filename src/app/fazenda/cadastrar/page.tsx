// src/app/fazenda/cadastrar/page.tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Tsukimi_Rounded } from "next/font/google";
import { Estado } from "@/types/Estado";
import { Municipio } from "@/types/Municipio";
import { getUFS } from "@/actions/get-ufs";
import { getMunicipios } from "@/actions/get-municipios";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

// --- schema apenas para FAZENDA ---
const farmSchema = z.object({
  farmName: z.string().min(3, "Informe o nome da fazenda"),
  address: z.string().min(5, "Informe o endereço"),
  state: z.string().length(2, "Selecione a UF"),
  city: z.string().min(2, "Informe a cidade"),
  size: z.number().min(1).max(3, "Informe o porte (1 a 3)"),
  affix: z.string().max(55, "Máximo 55 caracteres").optional().or(z.literal("")),
  affixType: z.enum(["preffix", "suffix"]).nullable(),
});

type FarmValues = z.infer<typeof farmSchema>;

export default function CadastrarFazendaPage() {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const form = useForm<FarmValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      farmName: "",
      address: "",
      state: "",
      city: "",
      size: 1,
      affix: "",
      affixType: null,
    },
    mode: "onSubmit",
  });

  const uf = form.watch("state");

  useEffect(() => {
    getUFS().then(setEstados).catch(console.error);
  }, []);

  useEffect(() => {
    if (uf && uf.length === 2) {
      getMunicipios(uf).then(setMunicipios).catch(console.error);
    } else {
      setMunicipios([]);
    }
  }, [uf]);

  function onSubmit(values: FarmValues) {
    console.log("Nova Fazenda:", values);
    toast.success("Fazenda cadastrada com sucesso!");
    // TODO: chamar sua API
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-[1000px] rounded-lg overflow-hidden shadow-lg"
        >
          {/* Top bar com seta */}
          <div className="absolute top-4 left-4 z-10">
            <Link href="/cadastro" className="text-black hover:text-red-900 transition-colors">
              <ArrowLeft className="w-7 h-7" strokeWidth={1} />
            </Link>
          </div>

          {/* Card full-width (estilo da coluna vermelha) */}
          <Card className="w-full bg-red-900 text-white border-0 shadow-none">
            <CardHeader className="pt-14 text-center">
              <CardTitle className={`${tsukimi.className} text-3xl font-semibold`}>
                Cadastrar Fazenda
              </CardTitle>
              <CardDescription className="!text-white text-sm">
                Preencha os dados da nova fazenda
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-8 pb-2">
              {/* Nome da Fazenda */}
              <FormField
                control={form.control}
                name="farmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome da Fazenda</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome da fazenda..."
                        className="bg-transparent text-white placeholder:text-white/70 border-white/70 focus:border-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Endereço */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Endereço / Localidade</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Rua, número, complemento…"
                        className="bg-transparent text-white placeholder:text-white/70 border-white/70 focus:border-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado e Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Estado (UF)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full data-[placeholder]:text-white/70 [&_svg:not([class*='text-'])]:text-white border-white/70 focus:border-white">
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
                      <FormLabel className="text-white">Cidade</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={municipios.length === 0}
                        >
                          <SelectTrigger className="w-full data-[placeholder]:text-white/70 [&_svg:not([class*='text-'])]:text-white border-white/70 focus:border-white">
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
                              <SelectItem value="__aguarde" disabled>
                                Selecione a UF primeiro
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Porte (Slider 1..3) */}
              <FormField
                control={form.control}
                name="size"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-white">Defina o porte</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3 px-1">
                        <span className="text-white/80 text-sm">Pequena</span>
                        <Slider
                          value={[value ?? 1]}
                          onValueChange={(v) => onChange(v[0])}
                          min={1}
                          max={3}
                          step={1}
                          className="w-full"
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

              {/* Afixo + Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Afixo (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex.: Fazenda Boa Esperança"
                          className="bg-transparent text-white placeholder:text-white/70 border-white/70 focus:border-white"
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
                    <FormItem>
                      <FormLabel className="text-white">Tipo de Afixo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(v) => field.onChange(v === "" ? null : v)}
                        >
                          <SelectTrigger className="w-full data-[placeholder]:text-white/70 [&_svg:not([class*='text-'])]:text-white border-white/70 focus:border-white">
                            <SelectValue placeholder="Selecione (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preffix">Prefixo</SelectItem>
                            <SelectItem value="suffix">Sufixo</SelectItem>
                            <SelectItem value="">— Nenhum —</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="p-8">
              <Button
                type="submit"
                className="w-40 ml-auto border border-white text-white bg-red-900 hover:bg-red-800 transition-colors flex items-center justify-center"
              >
                Salvar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>
  );
}
