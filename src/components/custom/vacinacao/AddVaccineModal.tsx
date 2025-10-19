'use client';

import React from "react";
import {getTipoVacinas} from "@/actions/getTipoVacinas";
import {useAuth} from "@/app/providers/AuthProvider";
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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {TipoVacina} from "@/types/TipoVacina";
import {calculaProximaDose} from "@/lib/utils";
import {aplicacaoVacinaScheme} from "@/zodSchemes/aplicacaoVacinaScheme";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {BiPlus} from "react-icons/bi";
import { ptBR } from "react-day-picker/locale";

type FormValues = z.infer<typeof aplicacaoVacinaScheme>;

export default function AddVaccineModal({ idAnimal }: { idAnimal: bigint }) {
    const { accessToken } = useAuth();
    const [vacinas, setVacinas] = React.useState<TipoVacina[] | null>(null);
    const [loadingVacinas, setLoadingVacinas] = React.useState<boolean>(true);

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
            idTipoVacina: undefined, // Inicia como indefinido para o placeholder funcionar
            dataAplicacao: "",
            proximaDose: "",
            lote: "",
            veterinario: "",
            observacoes: "",
        },
    });

    const { handleSubmit, watch, setValue, control } = form;

    const onSubmit = (data: FormValues) => {
        console.log("Dados validados:", data);
        // TODO: Adicionar lógica de submissão para a API
    };

    const idTipoVacinaWatched = watch("idTipoVacina");
    const dataAplicacao = watch("dataAplicacao");

    React.useEffect(() => {
        if (!dataAplicacao) {
            setValue("proximaDose", "");
            return;
        }

        const idStr = String(idTipoVacinaWatched ?? "0");
        if (idStr === "0" || !vacinas || vacinas.length === 0) {
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
            <DialogTrigger asChild>
                <Button variant={"secondary"} size={"sm"} className={"gap-2"}>
                    <BiPlus />
                    Adicionar Vacina
                </Button>
            </DialogTrigger>

            <DialogContent className={"max-w-2xl h-auto space-y-4"}>
                <DialogHeader>
                    <DialogTitle className={"font-tsukimi-rounded"}>Cadastro de Vacina</DialogTitle>
                    <DialogDescription>
                        Formulário para adicionar uma nova vacina aplicada no animal.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form} setError={form.setError}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 space-y-2">

                        <FormField
                            control={control}
                            name="idTipoVacina"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Vacina</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(BigInt(value))}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma vacina" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {loadingVacinas && <SelectItem value="0" disabled>Carregando...</SelectItem>}
                                            {!loadingVacinas && (!vacinas || vacinas.length === 0) && <SelectItem value="0" disabled>Nenhuma vacina cadastrada</SelectItem>}
                                            {vacinas?.map((tipo) => (
                                                <SelectItem key={String(tipo.id)} value={String(tipo.id)}>
                                                    {tipo.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                                >
                                                    {field.value ? (format(new Date(field.value), "dd/MM/yyyy")) : (<span>Selecione uma data</span>)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
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
                                        <Input disabled placeholder="Calculada automaticamente" {...field} />
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
                                        <Input placeholder="Digite o lote da vacina" {...field} value={field.value ?? ''} />
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
                                        <Input placeholder="Digite o nome do veterinário" {...field} value={field.value ?? ''} />
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
                                        <Input placeholder="Digite se houver observações" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full">Salvar Vacina</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}