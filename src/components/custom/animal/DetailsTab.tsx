import { Animal } from "@/types/Animal";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Weight, Activity } from "lucide-react";

interface DetailsTabProps {
    animal: Animal;
}

export const DetailsTab = ({ animal }: DetailsTabProps) => {
    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        const years = today.getFullYear() - birth.getFullYear();
        const months = today.getMonth() - birth.getMonth();

        if (years > 0) {
            return `${years} ${years === 1 ? 'ano' : 'anos'}`;
        }
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ativo":
                return "bg-primary text-primary-foreground";
            case "Vendido":
                return "bg-accent text-accent-foreground";
            case "Falecido":
                return "bg-destructive text-destructive-foreground";
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
                        <p className="text-lg font-semibold">{animal.registro}</p>
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
                            <p className="text-lg">{new Date(animal.dataNascimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{calculateAge(animal.dataNascimento)}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Peso Atual</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Weight className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg">{animal.peso} kg</p>
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
