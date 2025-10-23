import { Animal } from "@/types/Animal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Syringe, User, FileText } from "lucide-react";
import {Button} from "@/components/ui/button";
import {BiPlus} from "react-icons/bi";
import AddVaccineModal from "../vacinacao/AddVaccineModal";

interface HealthTabProps {
    animal: Animal;
}

export const HealthTab = ({ animal }: HealthTabProps) => {
    const isUpcoming = (nextDate?: string) => {
        if (!nextDate) return false;
        const next = new Date(nextDate);
        const today = new Date();
        const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30;
    };

    const isPastDue = (nextDate?: string) => {
        if (!nextDate) return false;
        const next = new Date(nextDate);
        const today = new Date();
        return next < today;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Histórico de Vacinação</h3>
                <Badge variant="outline" className="text-sm">
                    {animal.vacinacoes.length} {animal.vacinacoes.length === 1 ? 'vacina' : 'vacinas'} registrada(s)
                </Badge>
                <AddVaccineModal idAnimal={BigInt(animal.id)} />
            </div>

            <div className="grid gap-4">
                {animal.vacinacoes.map((vaccine) => (
                    <Card key={vaccine.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <div className="flex items-center gap-2">
                                    <Syringe className="h-5 w-5 text-primary" />
                                    {vaccine.tipoVacina.nome}
                                </div>
                                {vaccine.proximaDose && (
                                    <Badge
                                        variant={isPastDue(vaccine.proximaDose) ? "destructive" : isUpcoming(vaccine.proximaDose) ? "default" : "secondary"}
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
                                        <p className="text-sm">{new Date(vaccine.dataAplicacao).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>

                                {vaccine.proximaDose && (
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Próxima Dose</p>
                                            <p className="text-sm">{new Date(vaccine.proximaDose).toLocaleDateString('pt-BR')}</p>
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

            {animal.vacinacoes.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma vacina registrada para este animal</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
