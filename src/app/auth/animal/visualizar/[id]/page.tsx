"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockAnimals } from "@/data/mockAnimals";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, HeartPulse, Baby } from "lucide-react";
import { DetailsTab} from "@/components/custom/animal/DetailsTab";
import { GenealogyTab } from "@/components/custom/animal/GenealogyTab";
import { HealthTab } from "@/components/custom/animal/HealthTab";
import { OffspringTab } from "@/components/custom/animal/OffspringTab";
import { cn } from "@/lib/utils";
import {FcGenealogy} from "react-icons/fc";
import {MdOutlineBloodtype} from "react-icons/md";
import {FaCow} from "react-icons/fa6";

type TabType = "details" | "genealogy" | "health" | "offspring";

const AnimalDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("details");

    const animal = mockAnimals.find((a) => a.id === id);

    if (!animal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Animal não encontrado</h1>
                    <Button onClick={() => router.push("/")}>Voltar para listagem</Button>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: "details" as TabType, label: "Detalhes", icon: FileText },
        { id: "genealogy" as TabType, label: "Genealogia", icon: MdOutlineBloodtype },
        { id: "health" as TabType, label: "Saúde", icon: HeartPulse },
        { id: "offspring" as TabType, label: "Descendentes", icon: FaCow },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para listagem
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-tsukimi-rounded text-accent-red-triangulo">{animal.name}</h1>
                        <p className="text-muted-foreground">{animal.tag} • {animal.breed}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                                            <Icon className="h-5 w-5" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    <main className="lg:col-span-3">
                        <div className="bg-card rounded-lg border p-6">
                            {activeTab === "details" && <DetailsTab animal={animal} />}
                            {activeTab === "genealogy" && <GenealogyTab animal={animal} />}
                            {activeTab === "health" && <HealthTab animal={animal} />}
                            {activeTab === "offspring" && <OffspringTab animal={animal} />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AnimalDetails;
