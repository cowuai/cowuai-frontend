"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const tipoRacaOptions = [
  "NELORE", "GIR", "GIROLANDO", "BRAHMAN", "GUZERATE", "SINDI",
  "ANGUS", "BRANGUS", "LIMOUSIN", "CHIANINA", "DEVON", "BELGIANBLUE",
  "HEREFORD", "CANCHIM", "TABAPUA", "CARACU", "SENEPOL", "CHAROLAISE",
  "INDUBRASIL", "WAGYU", "SIMMENTAL", "CRIOULO", "JERSEY", "HOLANDES",
  "MURRAH", "MESTICO", "OUTROS"
] as const;

type TipoRaca = (typeof tipoRacaOptions)[number];

const sexoOptions = ["MACHO", "FEMEA", "INDETERMINADO"] as const;
type SexoAnimal = (typeof sexoOptions)[number];

interface FormData {
  nome: string;
  tipoRaca: TipoRaca | "";
  sexo: SexoAnimal | "";
  composicaoRacial: string;
  dataNascimento: string;
  numeroParticularProprietario: string;
  registro: string;
  status: "ativo";
  peso: string;
  idPai: string | null;
  idMae: string | null;
  idProprietario: number;
  idFazenda: number;
}

export default function CadastrarAnimalPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    tipoRaca: "",
    sexo: "",
    composicaoRacial: "",
    dataNascimento: "",
    numeroParticularProprietario: "",
    registro: "",
    status: "ativo",
    peso: "",
    idPai: null,
    idMae: null,
    idProprietario: 1,
    idFazenda: 1,
  });

  useEffect(() => setMounted(true), []);
  const darkMode = theme === "dark";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipoRaca) {
      toast.error("Escolha a raça do animal");
      return;
    }

    try {
      const requestBody = {
        ...formData,
        peso: Number(formData.peso),
        idPai: formData.idPai ? Number(formData.idPai) : null,
        idMae: formData.idMae ? Number(formData.idMae) : null,
        idProprietario: Number(formData.idProprietario),
        idFazenda: Number(formData.idFazenda),
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/animais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar animal");
      }

      const responseData = await response.json();
      toast.success("Animal cadastrado com sucesso!");
      console.log(responseData);

      // Limpar formulário
      setFormData({
        nome: "",
        tipoRaca: "",
        sexo: "",
        composicaoRacial: "",
        dataNascimento: "",
        numeroParticularProprietario: "",
        registro: "",
        status: "ativo",
        peso: "",
        idPai: null,
        idMae: null,
        idProprietario: 1,
        idFazenda: 1,
      });

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro inesperado ao cadastrar animal");
    }
  };

  if (!mounted) return null;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 bg-background text-foreground`}>
      <main className="flex-1 p-10 transition-colors duration-500">
        <h1 className={`text-3xl font-title mb-6 ${darkMode ? "text-white" : "text-red-900"}`}>
          Cadastrar Animal
        </h1>

        <div className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label>Nome</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full border rounded-md p-2"/>
            </div>

            <div>
              <label>Raça</label>
              <select name="tipoRaca" value={formData.tipoRaca} onChange={handleChange} required className="w-full border rounded-md p-2">
                <option value="">Selecione</option>
                {tipoRacaOptions.map(raca => (
                  <option key={raca} value={raca}>{raca}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Sexo</label>
              <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full border rounded-md p-2">
                <option value="">Selecione</option>
                {sexoOptions.map(sexo => (
                  <option key={sexo} value={sexo}>{sexo}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Composição Racial</label>
              <input type="text" name="composicaoRacial" value={formData.composicaoRacial} onChange={handleChange} className="w-full border rounded-md p-2"/>
            </div>

            <div>
              <label>Data de Nascimento</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="w-full border rounded-md p-2"/>
            </div>

            <div>
              <label>Peso (kg)</label>
              <input type="number" name="peso" value={formData.peso} onChange={handleChange} min={0} required className="w-full border rounded-md p-2"/>
            </div>

            <button type="submit" className="px-6 py-2 bg-red-900 text-white rounded-md hover:bg-red-700">Salvar</button>
          </form>
        </div>
      </main>
    </div>
  );
}
