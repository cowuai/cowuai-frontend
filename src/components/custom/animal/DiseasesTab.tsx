// components/custom/animal/DiseasesTab.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { apiFetch } from "@/helpers/ApiFetch";
import { useAuth } from "@/app/providers/AuthProvider";
import { DoencaAnimal } from "@/types/DoencaAnimal";
import { Doenca } from "@/types/Doenca";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, PlusCircle } from "lucide-react";

type DiseasesTabProps = {
    animalId: string;
    diseases: DoencaAnimal[];
    onDiseaseSaved?: () => Promise<void> | void;
};

export const DiseasesTab = ({ animalId, diseases, onDiseaseSaved }: DiseasesTabProps) => {
    const { accessToken } = useAuth();
    const [availableDiseases, setAvailableDiseases] = useState<Doenca[]>([]);
    const [loadingLista, setLoadingLista] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        idDoenca: "",
        dataDiagnostico: "",
        emTratamento: true,
        dataFimTratamento: "",
        observacoes: "",
    });

    // Busca lista de doenças cadastradas no sistema
    useEffect(() => {
        if (!accessToken) return;

        const loadDoencas = async () => {
            try {
                setLoadingLista(true);
                const data = (await apiFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/doencas`,
                    {
                        method: "GET",
                    },
                    accessToken
                )) as Doenca[];
                setAvailableDiseases(data);
            } catch (error) {
                console.error("Erro ao buscar doenças:", error);
            } finally {
                setLoadingLista(false);
            }
        };

        loadDoencas();
    }, [accessToken]);

    const doençasAtivas = useMemo(
        () => diseases.filter((d) => d.emTratamento),
        [diseases]
    );

    const historicoDoencas = useMemo(
        () => diseases.filter((d) => !d.emTratamento),
        [diseases]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken || !form.idDoenca) return;

        try {
            setSaving(true);

            await apiFetch(
                `${process.env.NEXT_PUBLIC_API_URL}/doencas-animal/animal/${animalId}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        idDoenca: Number(form.idDoenca),
                        dataDiagnostico:
                            form.dataDiagnostico || new Date().toISOString().substring(0, 10),
                        emTratamento: form.emTratamento,
                        dataFimTratamento:
                            form.emTratamento || !form.dataFimTratamento
                                ? null
                                : form.dataFimTratamento,
                        observacoes: form.observacoes || null,
                    }),
                },
                accessToken
            );

            // limpa form
            setForm({
                idDoenca: "",
                dataDiagnostico: "",
                emTratamento: true,
                dataFimTratamento: "",
                observacoes: "",
            });

            if (onDiseaseSaved) {
                await onDiseaseSaved();
            }
        } catch (error) {
            console.error("Erro ao salvar doença do animal:", error);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        // aceita "yyyy-MM-dd" ou ISO
        return dateStr.substring(0, 10).split("-").reverse().join("/");
    };

    return (
        <div className="space-y-6">
            {/* Resumo */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Doenças e tratamentos
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Registre doenças atuais e histórico de tratamentos do animal.
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                        <span>
                            Ativas:{" "}
                            <Badge variant={doençasAtivas.length ? "destructive" : "outline"}>
                                {doençasAtivas.length}
                            </Badge>
                        </span>
                        <span>
                            Histórico:{" "}
                            <Badge variant="outline">{historicoDoencas.length}</Badge>
                        </span>
                    </div>
                </CardHeader>
            </Card>

            {/* Lista de doenças ativas */}
            <Card>
                <CardHeader>
                    <CardTitle>Doenças ativas</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingLista && (
                        <div className="flex justify-center items-center py-6">
                            <Spinner />
                        </div>
                    )}

                    {!loadingLista && doençasAtivas.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Nenhuma doença ativa registrada para este animal.
                        </p>
                    )}

                    {!loadingLista && doençasAtivas.length > 0 && (
                        <div className="space-y-3">
                            {doençasAtivas.map((d) => (
                                <div
                                    key={d.id}
                                    className="flex flex-col gap-1 rounded-md border p-3 bg-red-50/60"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {d.doenca?.nome ?? "Doença sem nome"}
                                        </span>
                                        <Badge variant="destructive">Em tratamento</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Diagnóstico: {formatDate(d.dataDiagnostico)}
                                    </p>
                                    {d.observacoes && (
                                        <p className="text-xs text-muted-foreground">
                                            Observações: {d.observacoes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de doenças</CardTitle>
                </CardHeader>
                <CardContent>
                    {historicoDoencas.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Não há histórico de doenças finalizadas para este animal.
                        </p>
                    )}

                    {historicoDoencas.length > 0 && (
                        <div className="space-y-3">
                            {historicoDoencas.map((d) => (
                                <div
                                    key={d.id}
                                    className="flex flex-col gap-1 rounded-md border p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {d.doenca?.nome ?? "Doença sem nome"}
                                        </span>
                                        <Badge variant="outline">Tratamento encerrado</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Diagnóstico: {formatDate(d.dataDiagnostico)}{" "}
                                        {d.dataFimTratamento && (
                                            <>
                                                • Fim do tratamento:{" "}
                                                {formatDate(d.dataFimTratamento)}
                                            </>
                                        )}
                                    </p>
                                    {d.observacoes && (
                                        <p className="text-xs text-muted-foreground">
                                            Observações: {d.observacoes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Formulário para registrar nova doença */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Registrar nova doença
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="idDoenca">Doença</Label>
                                <Select
                                    value={form.idDoenca}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({ ...prev, idDoenca: value }))
                                    }
                                >
                                    <SelectTrigger id="idDoenca">
                                        <SelectValue placeholder="Selecione uma doença" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableDiseases.map((d) => (
                                            <SelectItem key={d.id} value={d.id.toString()}>
                                                {d.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dataDiagnostico">Data do diagnóstico</Label>
                                <Input
                                    id="dataDiagnostico"
                                    type="date"
                                    value={form.dataDiagnostico}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            dataDiagnostico: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="emTratamento"
                                    checked={form.emTratamento}
                                    onCheckedChange={(checked) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            emTratamento: Boolean(checked),
                                            // se marcar como em tratamento, limpa data fim
                                            dataFimTratamento: Boolean(checked)
                                                ? ""
                                                : prev.dataFimTratamento,
                                        }))
                                    }
                                />
                                <Label htmlFor="emTratamento">Ainda em tratamento</Label>
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="dataFimTratamento">
                                    Data de fim do tratamento
                                </Label>
                                <Input
                                    id="dataFimTratamento"
                                    type="date"
                                    disabled={form.emTratamento}
                                    value={form.dataFimTratamento}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            dataFimTratamento: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <textarea
                                id="observacoes"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                rows={3}
                                value={form.observacoes}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        observacoes: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving || !form.idDoenca}>
                                {saving ? "Salvando..." : "Salvar doença"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiseasesTab;
