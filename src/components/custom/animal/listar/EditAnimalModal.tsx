"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Animal, SexoAnimal, StatusAnimal } from "@/types/Animal";
import { getTipoRaca } from "@/actions/getTipoRaca";
import { getFazendasByIdProprietario } from "@/actions/getFazendasByIdProprietario";
import { useAuth } from "@/app/providers/AuthProvider";
import { getAnimalsByIdProprietario } from "@/actions/getAnimalsByIdProprietario";
import { Fazenda } from "@/types/Fazenda";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EditAnimalModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    animalToEdit: Animal | null;
    onSave: (animal: Animal) => Promise<void>;
    isLoading: boolean;
    tsukimiClassName: string;
}

// Helper mais robusto (evita quebrar se dateString for inválido)
const formatToLocalISO = (dateString: string | undefined | null): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; // Data inválida
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    } catch {
        return "";
    }
};

export const EditAnimalModal: React.FC<EditAnimalModalProps> = ({
                                                                    isOpen,
                                                                    setIsOpen,
                                                                    animalToEdit,
                                                                    onSave,
                                                                    isLoading,
                                                                    tsukimiClassName,
                                                                }) => {
    // Inicializa com objeto vazio seguro ou null
    const [formData, setFormData] = useState<Animal | null>(null);
    const [tipoRacaNome, setTipoRacaNome] = useState<string[]>([]);
    const { accessToken, usuario } = useAuth();

    // Listas de dados
    const [fazendasProprietario, setFazendasProprietario] = useState<Fazenda[]>([]);
    const [animaisProprietario, setAnimaisProprietario] = useState<Animal[]>([]);

    // Sincroniza o form quando o animalToEdit muda ou o modal abre
    useEffect(() => {
        if (isOpen && animalToEdit) {
            setFormData({ ...animalToEdit });
        } else if (!isOpen) {
            setFormData(null); // Limpa ao fechar para evitar flash de dados antigos
        }
    }, [isOpen, animalToEdit]);

    // Busca dados
    useEffect(() => {
        const loadData = async () => {
            if (!accessToken || !usuario?.id) return;

            try {
                const [fazendas, animais, racas] = await Promise.all([
                    getFazendasByIdProprietario(usuario.id, accessToken),
                    getAnimalsByIdProprietario(accessToken, usuario.id),
                    getTipoRaca(accessToken)
                ]);

                setFazendasProprietario(fazendas);
                if (Array.isArray(animais)) setAnimaisProprietario(animais);
                setTipoRacaNome(racas);
            } catch (error) {
                console.error("Erro ao carregar dados do modal", error);
            }
        };

        if (isOpen) {
            loadData();
        }
    }, [accessToken, usuario, isOpen]);

    const animaisMachos = useMemo(() =>
            animaisProprietario.filter((a) => a.sexo === SexoAnimal.MACHO && a.id !== formData?.id),
        [animaisProprietario, formData?.id]);

    const animaisFemeas = useMemo(() =>
            animaisProprietario.filter((a) => a.sexo === SexoAnimal.FEMEA && a.id !== formData?.id),
        [animaisProprietario, formData?.id]);

    const handleChange = (field: keyof Animal, value: any) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            await onSave(formData);
            // Opcional: setIsOpen(false) se o onSave não fechar
        }
    };

    if (!formData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl rounded-xl p-0 shadow-2xl border-none">
                <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
                    <DialogTitle className={`${tsukimiClassName} text-xl font-semibold text-primary`}>
                        Editar animal
                    </DialogTitle>
                    <DialogClose className="absolute right-4 top-4 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <span className="sr-only">Fechar</span>
                    </DialogClose>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid gap-4 max-h-[70vh] overflow-y-auto">

                        {/* Linha 1: Identificação */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Número do Brinco</Label>
                                <Input
                                    required
                                    value={formData.registro || ""}
                                    onChange={(e) => handleChange("registro", e.target.value)}
                                    className="border-red-900/20"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">N Particular</Label>
                                <Input
                                    value={formData.numeroParticularProprietario || ""}
                                    onChange={(e) => handleChange("numeroParticularProprietario", e.target.value)}
                                    className="border-red-900/20"
                                />
                            </div>
                        </div>

                        {/* Linha 2: Nome e Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold ">Nome</Label>
                                <Input
                                    value={formData.nome || ""}
                                    onChange={(e) => handleChange("nome", e.target.value)}
                                    className="border-red-900/20"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleChange("status", val)}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(StatusAnimal).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Linha 3: Raça e Sexo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Raça</Label>
                                <Select
                                    value={formData.tipoRaca || ""}
                                    onValueChange={(val) => handleChange("tipoRaca", val)}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipoRacaNome.map((raca) => (
                                            <SelectItem key={raca} value={raca}>
                                                {raca}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Sexo</Label>
                                <Select
                                    value={formData.sexo}
                                    onValueChange={(val) => handleChange("sexo", val)}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(SexoAnimal).map((sexo) => (
                                            <SelectItem key={sexo} value={sexo}>
                                                {sexo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Linha 4: Genealogia */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Mãe</Label>
                                {/* Convertendo para string no value para evitar erro se for null/number */}
                                <Select
                                    value={formData.idMae?.toString() || ""}
                                    onValueChange={(val) => handleChange("idMae", val ? Number(val) : null)}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione a mãe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {animaisFemeas.map((animal) => (
                                            <SelectItem key={animal.id} value={animal.id.toString()}>
                                                {animal.nome || `Brinco: ${animal.registro}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Pai</Label>
                                <Select
                                    value={formData.idPai?.toString() || ""}
                                    onValueChange={(val) => handleChange("idPai", val ? Number(val) : null)}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione o pai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {animaisMachos.map((animal) => (
                                            <SelectItem key={animal.id} value={animal.id.toString()}>
                                                {animal.nome || `Brinco: ${animal.registro}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Linha 5: Detalhes Físicos e Local */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Peso (Kg)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.peso || ""}
                                    onChange={(e) => handleChange("peso", e.target.value === "" ? 0 : Number(e.target.value))}
                                    className="border-red-900/20"
                                />
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <Label className="text-xs font-semibold">Composição Racial</Label>
                                <Input
                                    value={formData.composicaoRacial || ""}
                                    onChange={(e) => handleChange("composicaoRacial", e.target.value)}
                                    className="border-red-900/20"
                                />
                            </div>
                        </div>

                        {/* Linha 6: Logística */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Data Nascimento</Label>
                                <Input
                                    type="datetime-local"
                                    value={formatToLocalISO(formData.dataNascimento)}
                                    onChange={(e) => handleChange("dataNascimento", e.target.value)}
                                    className="border-red-900/20"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">Fazenda</Label>
                                <Select
                                    value={formData.idFazenda?.toString() || ""}
                                    onValueChange={(val) => handleChange("idFazenda", Number(val))}
                                >
                                    <SelectTrigger className="w-full border-red-900/20">
                                        <SelectValue placeholder="Selecione a fazenda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fazendasProprietario.map((fazenda) => (
                                            <SelectItem key={fazenda.id} value={fazenda.id.toString()}>
                                                {fazenda.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label className="text-xs font-semibold">Localização (Pasto/Lote)</Label>
                            <Input
                                value={formData.localizacao || ""}
                                onChange={(e) => handleChange("localizacao", e.target.value)}
                                className="border-red-900/20"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="text-red-900 border-red-900 hover:bg-red-50"
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-red-900 text-white hover:bg-red-800"
                        >
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};