import {Animal} from "@/types/animal";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CgGenderFemale, CgGenderMale} from "react-icons/cg";
import {ArcherContainer, ArcherElement} from "@gitii/react-archer";

interface GenealogyTabProps {
    animal: Animal;
}

export const GenealogyTab = ({animal}: GenealogyTabProps) => {
    return (
        <div className="space-y-6">
            <div className="text-center py-4">
                <h3 className="text-2xl font-bold mb-2">{animal.nome}</h3>
            <p className="text-muted-foreground">{animal?.registro || "-"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 bg-accent-blue/4 border-accent-blue/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CgGenderMale size={22}/>
                            Pai
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {animal.pai ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                    <p className="text-lg font-semibold">{animal.pai.nome}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tag</label>
                                    <p className="text-lg">{animal.pai?.registro || "-"}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Informação não disponível</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-2 bg-accent-pink/5 border-accent-pink/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CgGenderFemale size={22}/>
                            Mãe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {animal.mae ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                    <p className="text-lg font-semibold">{animal.mae.nome}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tag</label>
                                    <p className="text-lg">{animal.mae?.registro || "-"}</p>
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
                    <div className="flex flex-col items-center">

                        <ArcherContainer
                            strokeWidth={2}
                            endMarker={false}
                            lineStyle="curve"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* Linha dos pais */}
                            <div className="flex justify-center gap-12 mb-16">
                                <ArcherElement id="father">
                                    <div className="text-center p-4 bg-accent-blue/5 rounded-lg border border-accent-blue/10 min-w-[180px]">
                                        <p className="font-semibold">{animal.pai?.nome || "Desconhecido"}</p>
                                        <p className="text-sm text-muted-foreground">{animal.pai?.registro || "-"}</p>
                                    </div>
                                </ArcherElement>

                                <ArcherElement id="mother">
                                    <div className="text-center p-4 bg-accent-pink/5 rounded-lg border  border-accent-pink/20 min-w-[180px]">
                                        <p className="font-semibold">{animal.mae?.nome || "Desconhecido"}</p>
                                        <p className="text-sm text-muted-foreground">{animal.mae?.registro || "-"}</p>
                                    </div>
                                </ArcherElement>
                            </div>

                            {/* Filho */}
                            <ArcherElement
                                id="child"
                                relations={[
                                    {
                                        targetId: "father",
                                        sourceAnchor: "top",
                                        targetAnchor: "bottom",
                                        style: { strokeColor: "#3b82f6" },
                                    },
                                    {
                                        targetId: "mother",
                                        sourceAnchor: "top",
                                        targetAnchor: "bottom",
                                        style: { strokeColor: "#ec4899" },
                                    },
                                ]}
                            >
                                <div className="text-center p-4 bg-accent-yellow/10 rounded-lg border-2 border-accent-yellow/30 min-w-[200px]">
                                    <p className="font-bold">{animal.nome}</p>
                                    <p className="text-sm text-muted-foreground">{animal.registro || "-"}</p>
                                </div>
                            </ArcherElement>
                        </ArcherContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
