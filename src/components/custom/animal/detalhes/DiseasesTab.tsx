// src/components/custom/animal/DiseasesTab.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useAuth } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/helpers/ApiFetch";

import { Doenca } from "@/types/Doenca";
import { DoencaAnimal } from "@/types/DoencaAnimal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Normaliza uma string "YYYY-MM-DD" para "YYYY-MM-DDT00:00:00"
 * para evitar problema de fuso ao salvar no back como DateTime.
 */
function normalizeDateForApi(dateStr: string): string {
  if (!dateStr) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T00:00:00`;
  }
  return dateStr;
}

type DiseasesTabProps = {
  animalId: string;
  diseases: DoencaAnimal[];
  onDiseaseSaved?: () => Promise<void> | void;
};

export const DiseasesTab = ({
  animalId,
  diseases,
  onDiseaseSaved,
}: DiseasesTabProps) => {
  const { accessToken } = useAuth();
  const [availableDiseases, setAvailableDiseases] = useState<Doenca[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [saving, setSaving] = useState(false);

  // form de nova doença
  const [form, setForm] = useState({
    idDoenca: "",
    dataDiagnostico: "",
    emTratamento: true,
    dataFimTratamento: "",
    observacoes: "",
  });

  // estado para "encerrar doença"
  const [closingId, setClosingId] = useState<string | null>(null);
  const [closingDate, setClosingDate] = useState<string>("");

  // ====== 1. Buscar lista de doenças cadastradas no sistema ======
  useEffect(() => {
    if (!accessToken) return;

    const loadDoencas = async () => {
      try {
        setLoadingLista(true);

        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/doencas`,
          {
            method: "GET",
            credentials: "include",
          },
          accessToken
        );

        setAvailableDiseases((data as Doenca[]) ?? []);
      } catch (error) {
        console.error("Erro ao buscar doenças:", error);
      } finally {
        setLoadingLista(false);
      }
    };

    loadDoencas();
  }, [accessToken]);

  // ====== 2. Separar doenças ativas x histórico ======
  const doencasAtivas = useMemo(
    () => diseases.filter((d) => d.emTratamento),
    [diseases]
  );

  const historicoDoencas = useMemo(
    () => diseases.filter((d) => !d.emTratamento),
    [diseases]
  );

  // helper de data (corrige o problema do "dia anterior")
  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    try {
      let date: Date;
      // se vier só "YYYY-MM-DD", monta Date no fuso local
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(value);
      }
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return value;
    }
  };

  // ====== 3. Submit do formulário (nova doença) ======
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken || !form.idDoenca) return;

    try {
      setSaving(true);

      const rawDiagnostico =
        form.dataDiagnostico || new Date().toISOString().substring(0, 10);

      await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doencas-animal/animal/${animalId}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            idDoenca: Number(form.idDoenca),
            dataDiagnostico: normalizeDateForApi(rawDiagnostico),
            emTratamento: form.emTratamento,
            dataFimTratamento:
              form.emTratamento || !form.dataFimTratamento
                ? null
                : normalizeDateForApi(form.dataFimTratamento),
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

      // recarrega lista no pai
      if (onDiseaseSaved) {
        await onDiseaseSaved();
      }
    } catch (error) {
      console.error("Erro ao salvar doença do animal:", error);
    } finally {
      setSaving(false);
    }
  };

  // ====== 4. Abrir "formulário" de encerramento ======
  const handleOpenCloseForm = (id: string) => {
    setClosingId(id);
    setClosingDate(new Date().toISOString().substring(0, 10)); // default hoje
  };

  const handleCancelClose = () => {
    setClosingId(null);
    setClosingDate("");
  };

  // ====== 5. Confirmar encerramento (PUT /doencas-animal/:id) ======
  const handleCloseDisease = async (doencaAnimalId: string) => {
    if (!accessToken || !closingDate) return;

    try {
      setSaving(true);

      await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doencas-animal/${doencaAnimalId}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            emTratamento: false,
            dataFimTratamento: normalizeDateForApi(closingDate),
          }),
        },
        accessToken
      );

      handleCancelClose();

      if (onDiseaseSaved) {
        await onDiseaseSaved();
      }
    } catch (error) {
      console.error("Erro ao encerrar doença do animal:", error);
    } finally {
      setSaving(false);
    }
  };

  // ====== 6. Render ======
  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[220px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Doenças ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{doencasAtivas.length}</p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[220px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Histórico de doenças
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{historicoDoencas.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de doenças ativas */}
      <Card>
        <CardHeader>
          <CardTitle>Doenças ativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {doencasAtivas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma doença ativa registrada para este animal.
            </p>
          )}

          {doencasAtivas.map((d) => (
            <div
              key={d.id.toString()}
              className="space-y-2 border rounded-md px-3 py-2"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {d.doenca?.nome ?? "Doença desconhecida"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Diagnóstico:{" "}
                    {d.dataDiagnostico ? formatDate(d.dataDiagnostico) : "-"}
                  </p>
                  {d.observacoes && (
                    <p className="text-xs text-muted-foreground">
                      Observações: {d.observacoes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Ativa</Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenCloseForm(d.id)}
                  >
                    Encerrar doença
                  </Button>
                </div>
              </div>

              {closingId === d.id && (
                <div className="mt-2 rounded-md border px-3 py-2 bg-muted/40 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor={`fim-${d.id}`}>
                      Data de fim do tratamento
                    </Label>
                    <Input
                      id={`fim-${d.id}`}
                      type="date"
                      value={closingDate}
                      onChange={(e) => setClosingDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCloseDisease(d.id)}
                      disabled={!closingDate || saving}
                    >
                      {saving ? "Salvando..." : "Concluir"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de doenças</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {historicoDoencas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma doença passada registrada.
            </p>
          )}

          {historicoDoencas.map((d) => (
            <div
              key={d.id.toString()}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded-md px-3 py-2"
            >
              <div>
                <p className="font-medium">
                  {d.doenca?.nome ?? "Doença desconhecida"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Diagnóstico:{" "}
                  {d.dataDiagnostico ? formatDate(d.dataDiagnostico) : "-"}
                </p>
                {d.dataFimTratamento && (
                  <p className="text-xs text-muted-foreground">
                    Fim do tratamento: {formatDate(d.dataFimTratamento)}
                  </p>
                )}
                {d.observacoes && (
                  <p className="text-xs text-muted-foreground">
                    Observações: {d.observacoes}
                  </p>
                )}
              </div>
              <Badge variant="outline">Encerrada</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar doença atual</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idDoenca">Doença</Label>
                <select
                  id="idDoenca"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.idDoenca}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, idDoenca: e.target.value }))
                  }
                >
                  <option value="">
                    {loadingLista ? "Carregando..." : "Selecione uma doença"}
                  </option>
                  {availableDiseases.map((d) => (
                    <option key={d.id.toString()} value={d.id.toString()}>
                      {d.nome}
                    </option>
                  ))}
                </select>
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="emTratamento"
                checked={form.emTratamento}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    emTratamento: checked === true,
                    dataFimTratamento:
                      checked === true ? "" : prev.dataFimTratamento,
                  }))
                }
              />
              <Label htmlFor="emTratamento">Em tratamento</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFimTratamento">
                Data de fim do tratamento
              </Label>
              <Input
                id="dataFimTratamento"
                type="date"
                value={form.dataFimTratamento}
                disabled={form.emTratamento}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    dataFimTratamento: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.observacoes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                placeholder="Ex.: sintomas, medicamentos, recomendações do veterinário..."
              />
            </div>

            <Button type="submit" disabled={saving || loadingLista}>
              {saving ? "Salvando..." : "Salvar registro de doença"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
