// // src/components/custom/vacinacao/AddVaccineModal.tsx
'use client';

import React from "react";
import { getTipoVacinas } from "@/actions/getTipoVacinas";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TipoVacina } from "@/types/TipoVacina";
import { calculaProximaDose } from "@/lib/utils";
import { aplicacaoVacinaScheme } from "@/zodSchemes/aplicacaoVacinaScheme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { ptBR } from "react-day-picker/locale";
import { apiFetch } from "@/helpers/ApiFetch";

type Props = {
  idAnimal: bigint;
  sexoAnimal: "MACHO" | "FEMEA" | "TODOS"; // ⬅️ inclui TODOS
  onSaved?: () => void;
};

type FormValues = z.infer<typeof aplicacaoVacinaScheme>;

export default function AddVaccineModal({ idAnimal, sexoAnimal, onSaved }: Props) {
  const { accessToken } = useAuth();
  const [vacinas, setVacinas] = React.useState<TipoVacina[] | null>(null);
  const [loadingVacinas, setLoadingVacinas] = React.useState<boolean>(true);
  // abaixo dos useState de vacinas:
  const [sexError, setSexError] = React.useState<string | null>(null);

  const isDisallowed = (tipo: TipoVacina) => {
    const alvo = (tipo.generoAlvo ? String(tipo.generoAlvo) : "TODOS") as "MACHO" | "FEMEA" | "TODOS";
    if (sexoAnimal === "TODOS") return false;                 // animal "genérico" -> tudo permitido
    return !(alvo === "TODOS" || alvo === sexoAnimal);        // só bloqueia se for exclusivo do outro sexo
  };

  React.useEffect(() => {
    if (!accessToken) {
      setLoadingVacinas(true);
      return;
    }

    let mounted = true;
    setLoadingVacinas(true);

    getTipoVacinas(accessToken)
      .then((tipos) => {
        if (mounted) setVacinas(tipos);
      })
      .catch((err) => {
        if (mounted) {
          console.error("Erro ao buscar tipos de vacina:", err);
          setVacinas([]);
        }
      })
      .finally(() => {
        if (mounted) setLoadingVacinas(false);
      });

    return () => {
      mounted = false;
    }
  }, [accessToken]);

  const form = useForm<FormValues>({
    resolver: zodResolver(aplicacaoVacinaScheme),
    defaultValues: {
      idAnimal: idAnimal,
      idTipoVacina: undefined,
      dataAplicacao: "",
      proximaDose: "",
      lote: "",
      veterinario: "",
      observacoes: "",
    },
  });

  const { handleSubmit, watch, setValue, control, setError, reset } = form;

  // ⬇️ filtra as vacinas permitidas para o sexo do animal
  const allowedVacinas = React.useMemo(() => {
    if (!vacinas) return [];
    return vacinas.filter((v) => {
      const alvo = (v.generoAlvo ? String(v.generoAlvo) : "TODOS") as "MACHO" | "FEMEA" | "TODOS";
      if (sexoAnimal === "TODOS") return true;          // animal “qualquer” → mostra todas
      return alvo === "TODOS" || alvo === sexoAnimal;   // vacina para TODOS ou para o sexo do animal
    });
  }, [vacinas, sexoAnimal]);

  const idTipoVacinaWatched = watch("idTipoVacina");
  const dataAplicacao = watch("dataAplicacao");

  React.useEffect(() => {
    if (!dataAplicacao) {
      setValue("proximaDose", "");
      return;
    }

    const idStr = String(idTipoVacinaWatched ?? "0");
    if (idStr === "0" || !allowedVacinas || allowedVacinas.length === 0) {
      if (!loadingVacinas) setValue("proximaDose", "");
      return;
    }

    const tipo = allowedVacinas.find((t) => String(t.id) === idStr);
    if (!tipo) {
      setValue("proximaDose", "");
      return;
    }

    const proxima = calculaProximaDose(dataAplicacao, tipo.frequencia);
    setValue("proximaDose", proxima);
  }, [idTipoVacinaWatched, dataAplicacao, setValue, allowedVacinas, loadingVacinas]);

  const onSubmit = async (data: FormValues) => {
  // ⬇️ defesa extra: impede submissão se a vacina não é permitida ao sexo
  const selected = allowedVacinas.find(v => String(v.id) === String(data.idTipoVacina ?? ""));
  if (!selected) {
    setError("idTipoVacina", {
      type: "manual",
      message: sexoAnimal === "MACHO"
        ? "Esta vacina é exclusiva para fêmeas."
        : "Esta vacina é exclusiva para machos."
    });
    return;
  }

  // ⬇️ MONTA o payload serializando bigint -> string (JSON não suporta bigint)
  const payload = {
    idAnimal: String(data.idAnimal),
    idTipoVacina: String(data.idTipoVacina),
    dataAplicacao: data.dataAplicacao,              // yyyy-MM-dd
    proximaDose: data.proximaDose ?? null,          // pode ir null
    lote: data.lote || null,
    veterinario: data.veterinario || null,
    observacoes: data.observacoes || null,
  };

  try {
    if (!accessToken) throw new Error("Sem token de acesso.");

    // ⬇️ CORREÇÃO DE ROTA: garante /api/aplicacoes-vacina sem duplicar /api
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const url = base.endsWith("/api")
      ? `${base}/aplicacoes-vacina`
      : `${base}/api/aplicacoes-vacina`;

    console.log("[APLICAR VACINA] URL:", url, "payload:", payload);

    await apiFetch(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      accessToken
    );

    console.log("[APLICAR VACINA] Sucesso!");
    // opcional: limpar form
    reset({
      idAnimal,
      idTipoVacina: undefined,
      dataAplicacao: "",
      proximaDose: "",
      lote: "",
      veterinario: "",
      observacoes: "",
    });

    // notifica o pai para recarregar a lista
    if (onSaved) onSaved();
  } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
    console.error("[APLICAR VACINA] Erro:", msg);
    // feedback no campo geral, se quiser:
    setError("idTipoVacina", {
      type: "manual",
      message: msg || "Falha ao salvar vacina",
    });
  }
};

  // ⬇️ ADIÇÃO: handler para ver erros de validação no console (evita “clicar e nada acontecer”)
  const onInvalid = (errors: any) => {
    console.warn("[FORM INVÁLIDO] Erros:", errors);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"sm"} className={"gap-2"}>
          <BiPlus />
          Adicionar Vacina
        </Button>
      </DialogTrigger>

      <DialogContent className={"max-w-2xl h-auto space-y-4 bg-card"}>
        <DialogHeader>
          <DialogTitle className={"font-tsukimi-rounded text-primary"}>Cadastro de Vacina</DialogTitle>
          <DialogDescription>
            Formulário para adicionar uma nova vacina aplicada no animal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form} setError={form.setError}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="grid md:grid-cols-2 gap-4 space-y-2"
          >
            <FormField
              control={control}
              name="idTipoVacina"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vacina</FormLabel>
                  <Select
                    // se tentar selecionar uma vacina incompatível, não muda o valor e mostra aviso
                    onValueChange={(value) => {
                      const selected = vacinas?.find(v => String(v.id) === value);
                      if (selected && isDisallowed(selected)) {
                        setSexError(
                          `A vacina "${selected.nome}" é exclusiva para ${selected.generoAlvo === "MACHO" ? "MACHO" : "FÊMEA"}.`
                        );
                        // não altera o field
                        return;
                      }
                      setSexError(null);
                      field.onChange(BigInt(value));
                    }}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-stone-900">
                        <SelectValue placeholder="Selecione uma vacina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingVacinas && <SelectItem value="0" disabled>Carregando...</SelectItem>}
                      {!loadingVacinas && (!vacinas || vacinas.length === 0) && (
                        <SelectItem value="0" disabled>Nenhuma vacina cadastrada</SelectItem>
                      )}

                      {vacinas?.map((tipo) => {
                        const disabled = isDisallowed(tipo);
                        return (
                          <SelectItem
                            key={String(tipo.id)}
                            value={String(tipo.id)}
                            disabled={disabled}
                            title={disabled ? "Indisponível para o sexo deste animal" : undefined}
                          >
                            {tipo.nome}
                            {disabled ? " (indisponível)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {/* Mostra a mensagem SOMENTE quando o usuário tenta selecionar uma vacina incompatível */}
                  {sexError && <p className="text-sm text-red-600 mt-1">{sexError}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="dataAplicacao"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Data de Aplicação</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          disabled={allowedVacinas.length === 0}
                        >
                          {field.value ? (format(new Date(field.value + "T00:00:00"), "dd/MM/yyyy")) : (<span>Selecione uma data</span>)}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value + "T00:00:00") : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="proximaDose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próxima Dose</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Calculada automaticamente" value={field.value ? format(new Date(field.value + "T00:00:00"), "dd/MM/yyyy") : ""} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="lote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lote</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o lote da vacina" {...field} value={field.value ?? ''} disabled={allowedVacinas.length === 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="veterinario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinário</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do veterinário" {...field} value={field.value ?? ''} disabled={allowedVacinas.length === 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite se houver observações" {...field} value={field.value ?? ''} disabled={allowedVacinas.length === 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={allowedVacinas.length === 0}>
                Salvar Vacina
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
