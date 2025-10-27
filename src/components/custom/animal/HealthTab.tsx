// File: src/components/custom/animal/HealthTab.tsx
import { Animal } from "@/types/Animal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Syringe, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import AddVaccineModal from "../vacinacao/AddVaccineModal";


import { format, parse } from "date-fns";
// Quebra a string do back em partes Y-M-D
function parseApiDateParts(dateStr: string) {
  if (!dateStr) return null;

  // caso "yyyy-MM-dd"
  if (dateStr.length === 10) {
    const d = parse(dateStr, "yyyy-MM-dd", new Date());
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
  }

  // caso ISO com Z (ou offset)
  const d = new Date(dateStr);
  // usamos UTC para extrair os números "crus" da string
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() };
}

// EXIBIÇÃO: monta dd/MM/yyyy SEM criar Date (evita fuso)
function formatDateBR(dateStr?: string) {
  const parts = dateStr ? parseApiDateParts(dateStr) : null;
  if (!parts) return "";
  const dd = String(parts.d).padStart(2, "0");
  const mm = String(parts.m + 1).padStart(2, "0");
  return `${dd}/${mm}/${parts.y}`;
}

// COMPARAÇÃO: cria um “date-only” em UTC só para cálculos
function toUTCDateOnly(dateStr: string) {
  const parts = parseApiDateParts(dateStr)!;
  return new Date(Date.UTC(parts.y, parts.m, parts.d));
}

interface HealthTabProps {
    animal: Animal;
}

export const HealthTab = ({ animal }: HealthTabProps) => {
    // Normaliza aqui: se undefined, vira array vazio
    const vacinacoes = animal.vacinacoes ?? [];
    const count = vacinacoes.length;

 const isUpcoming = (nextDate?: string) => {
  if (!nextDate) return false;
  const next = toUTCDateOnly(nextDate);
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffDays = Math.ceil((next.getTime() - todayUTC.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 30;
};

const isPastDue = (nextDate?: string) => {
  if (!nextDate) return false;
  const next = toUTCDateOnly(nextDate);
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return next.getTime() < todayUTC.getTime();
};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Histórico de Vacinação</h3>
                <Badge variant="outline" className="text-sm">
                    {count} {count === 1 ? "vacina" : "vacinas"} registrada(s)
                </Badge>
               <AddVaccineModal 
               idAnimal={BigInt(animal.id)}
                sexoAnimal={animal.sexo as "MACHO" | "FEMEA" | "TODOS"}
                    onSaved={() => {
                        // depois você pode trocar por um refetch da rota do animal
                        window.location.reload();
                    }}
                />
            </div>

            {count === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma vacina registrada para este animal</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {vacinacoes.map((vaccine) => (
                        <Card key={vaccine.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                                        <Syringe className="h-5 w-5 text-primary" />
                                        {vaccine.tipoVacina.nome}
                                    </div>
                                    {vaccine.proximaDose && (
                                        <Badge
                                            variant={
                                                isPastDue(vaccine.proximaDose)
                                                    ? "destructive"
                                                    : isUpcoming(vaccine.proximaDose)
                                                        ? "default"
                                                        : "secondary"
                                            }
                                        >
                                            {isPastDue(vaccine.proximaDose) ? "Atrasada" : isUpcoming(vaccine.proximaDose) ? "Próxima" : "Agendada"}
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Data de Aplicação</p>
                                            <p className="text-sm">{formatDateBR(vaccine.dataAplicacao)}</p>

                                        </div>
                                    </div>

                                    {vaccine.proximaDose && (
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Próxima Dose</p>
                                                <p className="text-sm">{formatDateBR(vaccine.proximaDose)}</p>

                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Veterinário</p>
                                        <p className="text-sm">{vaccine.veterinario}</p>
                                    </div>
                                </div>

                                {vaccine.observacoes && (
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Observações</p>
                                            <p className="text-sm">{vaccine.observacoes}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
