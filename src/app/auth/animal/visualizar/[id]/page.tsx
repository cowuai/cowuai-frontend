"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {ArrowLeft, FileText, HeartPulse, BugIcon, DnaIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers/AuthProvider";

import { Animal } from "@/types/Animal";
import { getAnimal } from "@/actions/getAnimal";
import { getAnimalRelation } from "@/actions/getAnimalRelation";
import { DoencaAnimal } from "@/types/DoencaAnimal";
import { getDoencasByAnimal } from "@/actions/getDoencasByAnimal";

import { DetailsTab } from "@/components/custom/animal/detalhes/DetailsTab";
import { GenealogyTab } from "@/components/custom/animal/detalhes/GenealogyTab";
import { HealthTab } from "@/components/custom/animal/detalhes/HealthTab";
import { OffspringTab } from "@/components/custom/animal/detalhes/OffspringTab";
import { DiseasesTab } from "@/components/custom/animal/detalhes/DiseasesTab";
import { Spinner } from "@/components/ui/spinner";
import {SiLineageos} from "react-icons/si";

type TabType = "details" | "genealogy" | "health" | "offspring" | "diseases";

const AnimalDetails = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const {accessToken} = useAuth();

    const [animal, setAnimal] = useState<Animal | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("details");
    const [loading, setLoading] = useState(false);
    const [doencasAnimal, setDoencasAnimal] = useState<DoencaAnimal[]>([]);

    // 1. Carrega o animal básico
    useEffect(() => {
        if (!accessToken || !id) return;

        (async () => {
            try {
                setLoading(true);
                const data = await getAnimal(accessToken, id.toString());
                setAnimal(data);
            } catch (e) {
                console.error("Erro ao buscar animal:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, accessToken]);

    // 2. Quando muda de aba, busca a relação correspondente
    useEffect(() => {
        if (!accessToken || !id) return;

        const fetchRelation = async () => {
            try {
                if (activeTab === "genealogy" && (animal as any).pais) return;
                if (activeTab === "health" && (animal as any).vacinacoes) return;
                if (activeTab === "offspring" && (animal as any).filhos) return;

                setLoading(true);

                let relation: "pais" | "filhos" | "vacinacoes" | null = null;

                if (activeTab === "genealogy") relation = "pais";
                if (activeTab === "health") relation = "vacinacoes";
                if (activeTab === "offspring") relation = "filhos";

                if (!relation) {
                    setLoading(false);
                    return;
                }

                const res = await getAnimalRelation(accessToken, id.toString(), relation);

                // O backend retorna o próprio animal com os campos daquela relação preenchidos
                setAnimal((prev) => (prev ? { ...prev, ...res } : res));
            } catch (e) {
                console.error("Erro ao buscar relação:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchRelation();
    }, [activeTab, id, accessToken]);

    // 3. Quando estiver na aba de doenças, carrega doenças do animal
    useEffect(() => {
        if (!accessToken || !id) return;
        if (activeTab !== "diseases") return;

        const fetchDiseases = async () => {
            try {
                setLoading(true);
                const data = await getDoencasByAnimal(accessToken, id.toString(), false);
                setDoencasAnimal(data);
            } catch (e) {
                console.error("Erro ao buscar doenças do animal:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDiseases();
    }, [activeTab, id, accessToken]);

    const menuItems = [
        { id: "details" as TabType, label: "Detalhes", icon: FileText },
        { id: "genealogy" as TabType, label: "Genealogia", icon: DnaIcon },
        { id: "health" as TabType, label: "Saúde", icon: HeartPulse },
        { id: "offspring" as TabType, label: "Descendentes", icon: SiLineageos },
        { id: "diseases" as TabType, label: "Doenças", icon: BugIcon },
    ];

    const handleDiseaseSaved = async () => {
        if (!accessToken || !id) return;
        try {
            const data = await getDoencasByAnimal(accessToken, id.toString(), false);
            setDoencasAnimal(data);
        } catch (e) {
            console.error("Erro ao atualizar lista de doenças:", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!animal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-tsukimi-rounded font-bold mb-4">Animal não encontrado</h1>
                    <Button onClick={() => router.push("/")}>Voltar para listagem</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={"max-w-7xl mx-auto py-8 px-4 min-h-screen"}>
                <div className="container mx-auto px-4 py-4">
                    <Button variant="ghost" onClick={() => router.push("/auth/animal/listar")} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Voltar para listagem
                    </Button>
                    <div>
                        <h1 className="text-3xl font-tsukimi-rounded font-bold text-accent-red-triangulo">
                            {animal.nome}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {animal.registro} • {animal.tipoRaca}
                        </p>
                    </div>
                </div>

            <div className={"border-b border-background"}/>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-card rounded-lg border p-4 sticky top-4">
                            <h2 className="font-semibold mb-4">Menu</h2>
                            <nav className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors",
                                                activeTab === item.id
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <Icon className="h-5 w-5"/>
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo principal */}
                    <main className="lg:col-span-3">
                        <div className="bg-card rounded-lg border p-6">
                            {loading && (
                                <div className={"flex justify-center items-center h-64"}>
                                    <Spinner />
                                </div>
                            )}

                            {!loading && activeTab === "details" && <DetailsTab animal={animal}/>}
                            {!loading && activeTab === "genealogy" && (
                                <GenealogyTab animal={animal}/>
                            )}
                            {!loading && activeTab === "health" && <HealthTab animal={animal} />}
                            {!loading && activeTab === "offspring" && <OffspringTab animal={animal} />}
                            {!loading && activeTab === "diseases" && (
                                <DiseasesTab
                                    animalId={id.toString()}
                                    diseases={doencasAnimal}
                                    onDiseaseSaved={handleDiseaseSaved}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AnimalDetails;
