"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {ArrowLeft} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {useAuth} from "@/app/providers/AuthProvider";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Animal} from "@/types/Animal";
import {getAnimalsByIdProprietario} from "@/actions/getAnimalsByIdProprietario";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {getTipoRaca} from "@/actions/getTipoRaca";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";
import {getFazendasByIdProprietario} from "@/actions/getFazendasByIdProprietario";
import {Fazenda} from "@/types/Fazenda";

// ==========================
// Enums e Tipos
// ==========================
enum StatusAnimal {
    VIVO = "VIVO",
    FALECIDO = "FALECIDO",
    VENDIDO = "VENDIDO",
    DOADO = "DOADO",
    ROUBADO = "ROUBADO",
    REPRODUZINDO = "REPRODUZINDO",
    DOENTE = "DOENTE",
}

enum SexoAnimal {
    MACHO = "MACHO",
    FEMEA = "FEMEA"
}

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório").max(100),
    tipoRaca: z.string().min(1, "Selecione o tipo de raça"),
    composicaoRacial: z.string().optional(),
    numeroParticularProprietario: z.string().optional(),
    registro: z.string().optional(),
    sexo: z.enum([SexoAnimal.MACHO, SexoAnimal.FEMEA], {error: "Selecione o sexo"}),
    idFazenda: z.string().min(1, "Selecione uma fazenda"),
    idPai: z.string().optional(),
    idMae: z.string().optional(),
    dataNascimento: z.string().optional(),
    peso: z.string().optional(),
    localizacao: z.string().optional(),
    status: z.enum([
        StatusAnimal.VIVO,
        StatusAnimal.FALECIDO,
        StatusAnimal.VENDIDO,
        StatusAnimal.DOADO,
        StatusAnimal.ROUBADO,
        StatusAnimal.REPRODUZINDO,
        StatusAnimal.DOENTE,
    ]),
});

type FormValues = z.infer<typeof formSchema>;

// ==========================
// COMPONENTE PRINCIPAL
// ==========================
export default function CadastrarAnimalPage() {
    const router = useRouter();
    const {usuario, accessToken} = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [fazendasDoProprietario, setFazendasDoProprietario] = useState<Fazenda[]>([]);
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [animaisMachos, setAnimaisMachos] = useState<Animal[]>([]);
    const [animaisFemeas, setAnimaisFemeas] = useState<Animal[]>([]);
    const [tiposRaca, setTiposRaca] = useState<string[]>([]);
    

    // Fallbacks (apenas para evitar crash visual; chamadas reais exigem token/ID válidos)
    const usuarioAtivo = usuario ?? {id: 0, nome: "Usuário"};
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            tipoRaca: "",
            composicaoRacial: "",
            numeroParticularProprietario: "",
            registro: "",
            sexo: undefined,
            idFazenda: "",
            idPai: "",
            idMae: "",
            dataNascimento: "",
            peso: "",
            localizacao: "",
            status: StatusAnimal.VIVO,
        },
    });

    // ==========================
    // Carregar dados iniciais
    // ==========================
    useEffect(() => {
        const carregarTiposRaca = async () => {
            if (!accessToken) {
                setTiposRaca([]);
                return;
            }

            try {
                const tipos = await getTipoRaca(accessToken);
                setTiposRaca(tipos);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Erro ao carregar tipos de raça:", msg);
                toast.error("Erro ao carregar tipos de raça.");
            }
        };

        const carregarFazendas = async () => {
            if (!usuarioAtivo?.id || !accessToken) {
                setFazendasDoProprietario([]);
                return;
            }

            try {
                const resF = await getFazendasByIdProprietario(String(usuarioAtivo.id), accessToken);
                setFazendasDoProprietario(resF);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Erro ao carregar fazendas:", msg);
                toast.error("Erro ao carregar fazendas do proprietário.");
            }
        };

        const carregarAnimais = async () => {
            if (!usuarioAtivo?.id || !accessToken) {
                setAnimais([]);
                return;
            }

            try {
                const res = await getAnimalsByIdProprietario(accessToken, String(usuarioAtivo.id));
                setAnimais(res);
            } catch (_err: unknown) {
                // Não mostramos erro ao usuário nesta tela quando não houver animais.
                // Apenas garantimos que a lista de animais fique vazia.
                setAnimais([]);
            }
        }

        carregarTiposRaca();
        carregarFazendas();
        carregarAnimais();
    }, [usuarioAtivo?.id, accessToken]);

    useEffect(() => {
        if (!animais || animais.length === 0) {
            setAnimaisMachos([]);
            setAnimaisFemeas([]);
            return;
        }

        console.log("Animais carregados:", animais);
        const machos = animais.filter((animal) => animal.sexo === SexoAnimal.MACHO);
        const femeas = animais.filter((animal) => animal.sexo === SexoAnimal.FEMEA);

        setAnimaisMachos(machos);
        setAnimaisFemeas(femeas);
    }, [animais]);

    // ==========================
    // Funções de formulário
    // ==========================
    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (!values.idFazenda) {
                toast.error("Selecione uma fazenda antes de salvar.");
                return;
            }
            if (!usuarioAtivo?.id || !accessToken) {
                toast.error("Sessão inválida. Faça login novamente.");
                return;
            }

            // Normaliza o payload para os tipos esperados pelo backend / Prisma
            const pesoParsed = values.peso && values.peso !== ""
                ? parseFloat(values.peso.replace(",", "."))
                : NaN;

            const payload = {
                nome: values.nome,
                tipoRaca: values.tipoRaca,
                sexo: values.sexo,
                composicaoRacial: values.composicaoRacial || null,
                dataNascimento: values.dataNascimento ? new Date(values.dataNascimento) : null,
                numeroParticularProprietario: values.numeroParticularProprietario || null,
                registro: values.registro || null,
                status: values.status,
                // envia float ou null; evita enviar NaN
                peso: Number.isFinite(pesoParsed) ? pesoParsed : null,
                localizacao: values.localizacao || "",
                idPai: values.idPai ? (parseInt(values.idPai)) : null,
                idMae: values.idMae ? (parseInt(values.idMae)) : null,
                idProprietario: Number(usuarioAtivo.id),
                idFazenda: values.idFazenda ? parseInt(values.idFazenda) : null,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
                } catch {
                }
                throw new Error(msg);
            }

            toast.success("Animal cadastrado com sucesso!", {
                description: `${values.nome} foi adicionado ao sistema.`
            });

            router.push("/auth/animal/listar");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("Erro ao cadastrar animal:", err);
            toast.error(msg || "Erro ao cadastrar animal.");
        } finally {
            setIsLoading(false);
        }
    }

    // ==========================
    // RENDERIZAÇÃO
    // ==========================
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/auth/animal/listar"
                          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Voltar para animais
                    </Link>
                    <h1 className="text-3xl font-bold text-primary font-tsukimi-rounded mb-2">Cadastrar Animal</h1>
                    <BreadcrumbArea/>
                    <p className="text-muted-foreground mt-2">
                        Preencha as informações do animal para adicioná-lo ao sistema
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card rounded-lg border shadow-sm p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Informações Básicas */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground">Informações Básicas</h2>
                                <Separator/>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Nome *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome do animal" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sexo"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Sexo *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o sexo"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MACHO">Macho</SelectItem>
                                                        <SelectItem value="FEMEA">Fêmea</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="dataNascimento"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Data de Nascimento</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="peso"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Peso (kg)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0.00" step="0.01" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="localizacao"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Localização</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pasto, curral, etc." {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Raça e Genética */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground">Raça e Genética</h2>
                                <Separator/>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="tipoRaca"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Raça *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a raça"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {tiposRaca.map((raca) => (
                                                            <SelectItem key={raca} value={raca}>
                                                                {raca}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="composicaoRacial"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Composição Racial</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: 1/2 Angus, 1/2 Nelore" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="idPai"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Pai</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o pai"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {animaisMachos.map((animal) => (
                                                            <SelectItem key={animal.id} value={animal.id.toString()}>
                                                                {animal.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Opcional</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="idMae"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Mãe</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a mãe"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {animaisFemeas.map((animal) => (
                                                            <SelectItem key={animal.id} value={animal.id.toString()}>
                                                                {animal.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Opcional</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Registros e Identificação */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground">Registros e Identificação</h2>
                                <Separator/>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="numeroParticularProprietario"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Número Particular</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número do proprietário" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="registro"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Registro</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número de registro" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="idFazenda"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Fazenda *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma fazenda"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {fazendasDoProprietario.map((fazenda) => (
                                                        <SelectItem key={fazenda.id} value={fazenda.id.toString()}>
                                                            {fazenda.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Não encontrou a fazenda?{" "}
                                                <Link href="/auth/fazenda/cadastrar"
                                                      className="text-primary hover:underline">
                                                    Cadastre uma nova fazenda
                                                </Link>
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 justify-end pt-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/auth/animal/listar">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Cadastrar Animal"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
