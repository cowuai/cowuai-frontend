'use client';

import React from "react";
import { getTipoVacinas } from "@/actions/getTipoVacinas";
import { useAuth } from "@/app/providers/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TipoVacina, FrequenciaVacina, SexoAnimal } from "@/types/TipoVacina";
import { calculaProximaDose } from "@/lib/utils";
import { aplicacaoVacinaScheme } from "@/zodSchemes/aplicacaoVacinaScheme";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "../DatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BiPlus } from "react-icons/bi";

type FormValues = z.infer<typeof aplicacaoVacinaScheme>;

export default function AddVaccineModal({ idAnimal }: { idAnimal: bigint }) {
    const { accessToken } = useAuth();
    const [vacinas, setVacinas] = React.useState<TipoVacina[] | null>(null);
    const [loadingVacinas, setLoadingVacinas] = React.useState<boolean>(true);

    React.useEffect(() => {
        let mounted = true;
        setLoadingVacinas(true);

        getTipoVacinas(accessToken!)
            .then((tipos) => {
                if (!mounted) return;
                setVacinas(tipos);
            })
            .catch((err) => {
                if (!mounted) return;
                setVacinas([]);
            })
            .finally(() => {
                if (!mounted) return;
                setLoadingVacinas(false);
            });

        return () => {
            mounted = false;
        };
    }, [accessToken]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(aplicacaoVacinaScheme),
        defaultValues: {
            idAnimal: idAnimal,
            idTipoVacina: BigInt(0),
            dataAplicacao: "",
            proximaDose: "",
            lote: "",
            veterinario: "",
            observacoes: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log("Dados validados:", data);
    };

    const idTipoVacinaWatched = watch("idTipoVacina");
    const dataAplicacao = watch("dataAplicacao");

    // Quando idTipoVacina ou dataAplicacao mudarem, calcular e preencher proximaDose
    React.useEffect(() => {
        // se não houver data de aplicação, limpa próxima dose
        if (!dataAplicacao) {
            setValue("proximaDose", "");
            return;
        }

        // idTipoVacina vem como string do select (ou bigint) - normalizar
        const idStr = typeof idTipoVacinaWatched === "string" ? idTipoVacinaWatched : String(idTipoVacinaWatched ?? "0");
        if (!idStr || idStr === "0") {
            setValue("proximaDose", "");
            return;
        }

        // buscar o tipo selecionado e usar sua frequencia (aguarda vacinas carregadas)
        if (!vacinas || vacinas.length === 0) {
            // se ainda carregando, aguardar; se carregado vazio, limpa
            if (!loadingVacinas) setValue("proximaDose", "");
            return;
        }

        const tipo = vacinas.find((t) => String(t.id) === idStr);
        if (!tipo) {
            setValue("proximaDose", "");
            return;
        }
        const proxima = calculaProximaDose(dataAplicacao, tipo.frequencia);
        setValue("proximaDose", proxima);
    }, [idTipoVacinaWatched, dataAplicacao, setValue, vacinas, loadingVacinas]);

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={"secondary"} size={"sm"} className={"gap-2"}  >
                    <BiPlus />
                    Adicionar Vacina
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastro de Vacina</DialogTitle>
                    <DialogDescription>
                        Formulário para adicionar uma nova vacina aplicada no animal.
                    </DialogDescription>
                </DialogHeader>

                {/* Formulário de cadastro de vacina abaixo */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="idTipoVacina">Tipo de Vacina</Label>
                        <Select>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Selecione uma vacina" {...register("idTipoVacina")} />
                            </SelectTrigger>
                            {/* Opções de vacina */}
                            <SelectContent>
                                {/** Carrega as vacinas e renderiza opções quando disponíveis */}
                                {loadingVacinas && (
                                    <SelectItem key="loading" value="0">
                                        <Spinner />
                                    </SelectItem>
                                )}
                                {!loadingVacinas && vacinas && vacinas.length === 0 && (
                                    <SelectItem key="empty" value="0">
                                        Nenhuma vacina cadastrada
                                    </SelectItem>
                                )}
                                {vacinas && vacinas.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <DatePicker labelText="Data de Aplicação" />
                    </div>

                    <div>
                        <Label htmlFor="proximaDose">Próxima Dose</Label>
                        <Input disabled id="proximaDose" {...register("proximaDose")} />
                        <p className="text-sm text-muted-foreground">
                            A próxima dose será calculada automaticamente com base na frequência da vacina selecionada.
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="lote">Lote</Label>
                        <Input id="lote" {...register("lote")} />
                    </div>
                    <div>
                        <Label htmlFor="veterinario">Veterinário</Label>
                        <Input id="veterinario" {...register("veterinario")} />
                    </div>
                    <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Input id="observacoes" {...register("observacoes")} />
                    </div>
                    <Button type="submit">Salvar Vacina</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}