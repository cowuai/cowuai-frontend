import { Animal } from "@/types/animal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenealogyTabProps {
    animal: Animal;
}

export const GenealogyTab = ({ animal }: GenealogyTabProps) => {
    return (
        <div className="space-y-6">
            <div className="text-center py-4">
                <h3 className="text-2xl font-bold mb-2">{animal.name}</h3>
                <p className="text-muted-foreground">{animal.tag}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/20">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">👨</span>
                            Pai
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {animal.father ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                    <p className="text-lg font-semibold">{animal.father.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tag</label>
                                    <p className="text-lg">{animal.father.tag}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Informação não disponível</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-2 border-accent/20">
                    <CardHeader className="bg-accent/5">
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">👩</span>
                            Mãe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {animal.mother ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                    <p className="text-lg font-semibold">{animal.mother.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tag</label>
                                    <p className="text-lg">{animal.mother.tag}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Informação não disponível</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-primary/30">
                <CardHeader>
                    <CardTitle>Árvore Genealógica</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30 min-w-[200px]">
                            <p className="font-bold">{animal.name}</p>
                            <p className="text-sm text-muted-foreground">{animal.tag}</p>
                        </div>

                        <div className="w-px h-8 bg-border"></div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20 min-w-[180px]">
                                <p className="font-semibold">{animal.father?.name || "Desconhecido"}</p>
                                <p className="text-sm text-muted-foreground">{animal.father?.tag || "-"}</p>
                            </div>
                            <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20 min-w-[180px]">
                                <p className="font-semibold">{animal.mother?.name || "Desconhecido"}</p>
                                <p className="text-sm text-muted-foreground">{animal.mother?.tag || "-"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
