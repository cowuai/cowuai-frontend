'use client';

import {useAuth} from "@/app/providers/AuthProvider";
import React, {useState, useEffect} from "react";
import {VacinaAplicada} from "@/types/Animal";
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
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {calculaProximaDose} from "@/lib/utils";
import {BiEdit} from "react-icons/bi";
import {apiFetch} from "@/helpers/ApiFetch";
import {toast} from "sonner";
import {format} from "date-fns";

type UpdateVaccineModalProps = {
    vaccine: VacinaAplicada;
    onSavedAction?: () => void;
}

export default function UpdateVaccineModal({vaccine, onSavedAction}: UpdateVaccineModalProps) {
    const {accessToken} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm({
        defaultValues: {
            dataAplicacao: new Date(vaccine.dataAplicacao),
            numeroDose: vaccine.numeroDose,
            lote: vaccine.lote || "",
            proximaDose: vaccine.proximaDose ? new Date(vaccine.proximaDose) : null,
            veterinario: vaccine.veterinario || "",
            observacoes: vaccine.observacoes || "",
        },
    });

    const dataAplicacao = form.watch("dataAplicacao");
    useEffect(() => {
        if (!dataAplicacao) return;
        const proxima = calculaProximaDose(dataAplicacao.toISOString(), vaccine.tipoVacina.frequencia);
        form.setValue("proximaDose", new Date(proxima));
    }, [dataAplicacao, vaccine.tipoVacina.frequencia]);

    const {handleSubmit, control, reset} = form;

    const onSubmit = async (data: any) => {
        console.log("Form data submitted:", data);

        if (!accessToken) {
            toast.error("Usuário não autenticado.");
            return;
        }

        setIsLoading(true);

        const payload = {
            dataAplicacao: data.dataAplicacao.toISOString(),
            proximaDose: data.proximaDose ? data.proximaDose.toISOString() : null,
            numeroDose: data.numeroDose,
            lote: data.lote || null,
            veterinario: data.veterinario || null,
            observacoes: data.observacoes || null,
        };

        try {
            await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/aplicacoes-vacina/${vaccine.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }, accessToken);

            setIsLoading(false);
            toast.success("Vacina atualizada com sucesso!");
            setOpen(false);
            if (onSavedAction) {
                onSavedAction();
            }
            reset();
        } catch (error) {
            setIsLoading(false);
            if (error instanceof Error) {
                toast.error(`Erro ao atualizar vacina: ${error.message}`);
            } else {
                toast.error("Erro ao atualizar vacina.");
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"} size={"sm"} className={"gap-2"}>
                    <BiEdit/>
                    Atualizar Vacina
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card">
                <DialogHeader>
                    <DialogTitle className={"font-tsukimi-rounded text-primary"}>Atualizar Vacina</DialogTitle>
                    <DialogDescription>
                        Atualize as informações da vacina aplicada ao animal.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} setError={form.setError}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={control}
                            name="dataAplicacao"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Data de Aplicação</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            value={field.value.toISOString().split('T')[0]}
                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="proximaDose"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Próxima Dose</FormLabel>
                                    <FormControl>
                                        <Input disabled placeholder="Calculada automaticamente"
                                               value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="lote"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lote</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o lote da vacina" {...field}
                                               value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="veterinario"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Veterinário</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o nome do veterinário" {...field}
                                               value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="observacoes"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite se houver observações" {...field}
                                               value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}