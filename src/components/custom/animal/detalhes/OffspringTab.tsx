import {Animal} from "@/types/Animal";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Calendar, Heart} from "lucide-react";
import {SexoAnimal} from "@/types/TipoVacina";
import {PiCow} from "react-icons/pi";

interface OffspringTabProps {
    animal: Animal;
}

export const OffspringTab = ({animal}: OffspringTabProps) => {
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

    // Garante que as listas existam, mesmo que vazias
    const filhosComoPai = animal.filhosComoPai ?? [];
    const filhosComoMae = animal.filhosComoMae ?? [];

    // Define os filhos de acordo com o sexo
    const filhos: Animal[] =
        animal.sexo === SexoAnimal.MACHO
            ? filhosComoPai.filter((filho: Animal) => filho.idPai === animal.id)
            : filhosComoMae.filter((filho: Animal) => filho.idMae === animal.id);

    const maleOffspring = filhos.filter(o => o.sexo === SexoAnimal.MACHO);
    const femaleOffspring = filhos.filter(o => o.sexo === SexoAnimal.FEMEA);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Descendentes</h3>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-primary/5">
                        {maleOffspring.length} {maleOffspring.length === 1 ? 'macho' : 'machos'}
                    </Badge>
                    <Badge variant="outline" className="bg-accent/5">
                        {femaleOffspring.length} {femaleOffspring.length === 1 ? 'fêmea' : 'fêmeas'}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4">
                {filhos.map((offspring) => (
                    <Card key={offspring.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{offspring.sexo === "Macho" ? "🐂" : "🐄"}</span>
                                    {offspring.nome}
                                </div>
                                <Badge variant={offspring.sexo === "Macho" ? "default" : "secondary"}>
                                    {offspring.sexo}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tag</p>
                                    <p className="text-sm font-semibold">{offspring.registro}</p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                                        {offspring.dataNascimento ? (
                                            <><p
                                                className="text-sm">{new Date(offspring.dataNascimento).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-xs text-muted-foreground">{calculateAge(offspring.dataNascimento)}</p></>
                                        ) : (
                                            <p className="text-sm italic text-muted-foreground">Informação não
                                                disponível</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 pt-2 border-t">
                                <Heart className="h-4 w-4 text-muted-foreground mt-0.5"/>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Outro Progenitor {animal.sexo === "Macho" ? "(Mãe)" : "(Pai)"}
                                    </p>
                                    {animal.sexo === "Macho" ? (
                                        <>
                                            <p className="text-sm font-semibold">{offspring.mae?.nome}</p>
                                            <p className="text-xs text-muted-foreground">{offspring.mae?.registro}</p>
                                        </>
                                        ) : (
                                        <>
                                            <p className="text-sm font-semibold">{offspring.pai?.nome}</p>
                                            <p className="text-xs text-muted-foreground">{offspring.pai?.registro}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filhos.length === 0 && (
                <Card>
                    <CardContent className="flex py-12 text-center align-middle flex-col items-center justify-center gap-4">
                        <PiCow size={45}/>
                        <p className="text-muted-foreground">Nenhum descendente registrado para este animal</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
