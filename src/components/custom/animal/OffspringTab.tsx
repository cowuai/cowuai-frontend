import { Animal } from "@/types/Animal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart } from "lucide-react";

interface OffspringTabProps {
    animal: Animal;
}

export const OffspringTab = ({ animal }: OffspringTabProps) => {
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

    const maleOffspring = animal.offspring.filter(o => o.gender === "Macho");
    const femaleOffspring = animal.offspring.filter(o => o.gender === "Fêmea");

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
                {animal.offspring.map((offspring) => (
                    <Card key={offspring.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{offspring.gender === "Macho" ? "🐂" : "🐄"}</span>
                                    {offspring.name}
                                </div>
                                <Badge variant={offspring.gender === "Macho" ? "default" : "secondary"}>
                                    {offspring.gender}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tag</p>
                                    <p className="text-sm font-semibold">{offspring.tag}</p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                                        <p className="text-sm">{new Date(offspring.birthDate).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-xs text-muted-foreground">{calculateAge(offspring.birthDate)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 pt-2 border-t">
                                <Heart className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Outro Progenitor {animal.gender === "Macho" ? "(Mãe)" : "(Pai)"}
                                    </p>
                                    <p className="text-sm font-semibold">{offspring.otherParent.name}</p>
                                    <p className="text-xs text-muted-foreground">{offspring.otherParent.tag}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {animal.offspring.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-6xl mb-4">👶</div>
                        <p className="text-muted-foreground">Nenhum descendente registrado para este animal</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
