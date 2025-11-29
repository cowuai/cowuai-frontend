"use client";

import { useEffect, useState } from "react";
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

// Tipos necessários
type SexoAnimal = "Macho" | "Fêmea";
type StatusAnimal = "VIVO" | "FALECIDO" | "VENDIDO" | "DOADO" | "ROUBADO";

export interface Animal {
  id: number;
  nome: string;
  tipoRaca: string;
  sexo: SexoAnimal;
  composicaoRacial: string | null;
  dataNascimento: string | null;
  peso: number | null;
  idFazenda: number;
  numeroParticularProprietario: string;
  dataEntrada: string;
  observacoes: string | null;
  registro: string | null;
  status: StatusAnimal;
  idPai: number | null;
  idMae: number | null;
}

interface EditAnimalModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  animalToEdit: Animal | null;
  onSave: (animal: Animal) => Promise<void>; // Função que chama a API
  isLoading: boolean;
  tsukimiClassName: string;
}

// Helper para formatar data para o input datetime-local
const formatToLocalISO = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
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
  const [formData, setFormData] = useState<Animal | null>(null);

  // Atualiza o formulário quando o animal selecionado muda
  useEffect(() => {
    if (animalToEdit) {
      setFormData({ ...animalToEdit });
    }
  }, [animalToEdit]);

  const handleChange = (field: keyof Animal, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl w-[90vw] bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden">
        <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
          <DialogTitle
            className={`${tsukimiClassName} text-xl font-semibold text-red-800`}
          >
            Editar animal
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
            <X className="h-5 w-5 text-red-900" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 grid gap-4 max-h-[70vh] overflow-y-auto">
            {/* Linha 1: ID e Brinco */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  ID
                </label>
                <Input
                  disabled
                  value={formData.id}
                  className="bg-red-50/80 border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Número do Brinco
                </label>
                <Input
                  value={formData.numeroParticularProprietario}
                  onChange={(e) =>
                    handleChange("numeroParticularProprietario", e.target.value)
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
            </div>

            {/* Linha 1.5: Registro e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Registro
                </label>
                <Input
                  value={formData.registro || ""}
                  onChange={(e) => handleChange("registro", e.target.value)}
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as StatusAnimal)
                  }
                  className="border rounded-md p-2 text-gray-700 border-red-900/20 bg-white"
                >
                  {["VIVO", "FALECIDO", "VENDIDO", "DOADO", "ROUBADO"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Linha 2: Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                Nome do Animal
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="border-red-900/20 text-gray-700"
              />
            </div>

            {/* Linha 3: Raça e Sexo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Raça
                </label>
                <Input
                  value={formData.tipoRaca}
                  onChange={(e) => handleChange("tipoRaca", e.target.value)}
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Sexo
                </label>
                <select
                  value={formData.sexo}
                  onChange={(e) =>
                    handleChange("sexo", e.target.value as SexoAnimal)
                  }
                  className="border rounded-md p-2 text-gray-700 border-red-900/20 bg-white"
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>

            {/* Linha 4: Composição e Peso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Composição Racial
                </label>
                <Input
                  value={formData.composicaoRacial || ""}
                  onChange={(e) =>
                    handleChange("composicaoRacial", e.target.value)
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Peso (Kg)
                </label>
                <Input
                  type="number"
                  value={formData.peso || 0}
                  onChange={(e) => handleChange("peso", Number(e.target.value))}
                  className="border-red-900/20 text-gray-700"
                />
              </div>
            </div>

            {/* Linha 5: ID Mãe, Pai e Fazenda */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  ID Mãe
                </label>
                <Input
                  type="number"
                  value={formData.idMae || ""}
                  onChange={(e) =>
                    handleChange(
                      "idMae",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  ID Pai
                </label>
                <Input
                  type="number"
                  value={formData.idPai || ""}
                  onChange={(e) =>
                    handleChange(
                      "idPai",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  ID Fazenda
                </label>
                <Input
                  type="number"
                  value={formData.idFazenda}
                  onChange={(e) =>
                    handleChange("idFazenda", Number(e.target.value))
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Data Nascimento
                </label>
                <Input
                  type="datetime-local"
                  value={formatToLocalISO(formData.dataNascimento)}
                  onChange={(e) =>
                    handleChange("dataNascimento", e.target.value)
                  }
                  className="border-red-900/20 text-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Data Entrada
                </label>
                <Input
                  type="datetime-local"
                  value={formatToLocalISO(formData.dataEntrada)}
                  onChange={(e) => handleChange("dataEntrada", e.target.value)}
                  className="border-red-900/20 text-gray-700"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                Observações
              </label>
              <Input
                value={formData.observacoes || ""}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                className="border-red-900/20 text-gray-700 h-16"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 rounded-md text-red-900 border-3 border-red-900 bg-transparent hover:bg-red-50/50"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-red-900 text-white hover:bg-red-800"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
