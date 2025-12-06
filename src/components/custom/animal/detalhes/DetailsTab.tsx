import {Animal, StatusAnimal} from "@/types/animal";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Weight, Activity } from "lucide-react";
import {calculateAge} from "@/lib/utils";

interface DetailsTabProps {
    animal: Animal;
}

export const DetailsTab = ({ animal }: DetailsTabProps) => {
    const getStatusColor = (status: StatusAnimal) => {
        switch (status) {
            case "VIVO":
                return "bg-accent-green text-primary-foreground";
            case "VENDIDO":
                return "bg-foreground text-white";
            case "FALECIDO":
                return "bg-destructive text-destructive-foreground";
            case "DOADO":
                return "bg-warning text-warning-foreground";
            case "ROUBADO":
                return "bg-secondary text-secondary-foreground";
            case "DOENTE":
                return "bg-accent-yellow text-primary-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
                <div className="text-8xl">🐄</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Nome</label>
                        <p className="text-lg font-semibold">{animal.nome}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Tag de Identificação</label>
                        <p className="text-lg font-semibold">{animal?.registro || "-"}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Botton:</label>
                        <p className="text-lg">{animal?.numeroParticularProprietario || "-"}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Raça</label>
                        <p className="text-lg">{animal.tipoRaca}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Sexo</label>
                        <p className="text-lg">{animal.sexo}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {animal.dataNascimento ? (
                                <p className="text-lg">{new Date(animal.dataNascimento).toLocaleDateString('pt-BR')}</p>
                            ) : (
                                <p className="text-lg text-muted-foreground">--</p>
                            )}
                        </div>
                        {animal.dataNascimento ? (
                            <p className="text-sm text-muted-foreground mt-1">{calculateAge(animal.dataNascimento)}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-1">Idade não disponível</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Peso Atual</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Weight className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg">{animal.peso ? (animal.peso + "kg") : ("-")} </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Localização</label>
                        <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg">{animal?.localizacao || "-"}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="mt-1">
                            <Badge className={getStatusColor(animal.status)}>
                                <Activity className="h-3 w-3 mr-1" />
                                {animal.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
