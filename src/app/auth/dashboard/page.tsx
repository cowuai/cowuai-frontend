"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useAuth } from "@/app/providers/AuthProvider";
import { Cross } from "lucide-react";
import BreadcrumbArea from "@/components/custom/BreadcrumbArea";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function DashboardPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { accessToken } = useAuth(); 
  const darkMode = theme === "dark";

  useEffect(() => setMounted(true), []);

  // ---------- Dados falsos temporários ----------
  const [lineData, setLineData] = useState<any>({
    labels: ["Total"],
    datasets: [
      {
        label: "Animais Doentes",
        data: [0],
        borderColor: "#EF4444",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  });

  const [areaData, setAreaData] = useState<any>({
    labels: ["2019", "2020", "2021"],
    datasets: [
      {
        label: "Animais cadastrados (por ano)",
        data: [1, 1, 1],
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        borderColor: "#10B981",
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  });

  const [barData, setBarData] = useState<any>({
    labels: ["Baias 3", "Baias 5", "Pastagem A"],
    datasets: [
      { label: "Animais", data: [1, 1, 1], backgroundColor: ["#FF5722", "#009688", "#006064"] },
    ],
  });

  const [pieData, setPieData] = useState<any>({
    labels: ["GIR", "HOLANDES", "GIROLANDO"],
    datasets: [{ data: [1, 1, 1], backgroundColor: ["#FF5722", "#009688", "#006064"], borderWidth: 0 }],
  });

  const [sexoPieData, setSexoPieData] = useState<any>({
    labels: ["Macho", "Fêmea", "Indeterm."],
    datasets: [{ data: [0, 0, 0], backgroundColor: ["#2196F3", "#E91E63", "#9E9E9E"] }],
  });

  const [vacinasBarData, setVacinasBarData] = useState<any>({
    labels: [],
    datasets: [{ label: "Vacinas aplicadas", data: [], backgroundColor: "#9C27B0" }],
  });

  const [animaisDoentes, setAnimaisDoentes] = useState<number>(0);
  const [taxaReproducao, setTaxaReproducao] = useState<number>(0);

  // ---------- Dados reais do backend ----------
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const res = await fetch(`${base}/dashboard`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data?.vacinacoesPorMes) {
          const labels = data.vacinacoesPorMes.map((v: any) => v.label);
          const values = data.vacinacoesPorMes.map((v: any) => v.count);
          // vacinacoesPorMes: apenas o gráfico de barras de vacinas
          setVacinasBarData({ labels, datasets: [{ ...vacinasBarData.datasets[0], data: values }] });
        }

        // Animais doentes
        if (data?.animaisDoentes !== undefined) {
          setLineData({ labels: ["Total"], datasets: [{ ...lineData.datasets[0], data: [Number(data.animaisDoentes)] }] });
        }

        if (data?.animaisPorLocalizacao) {
          const labels = data.animaisPorLocalizacao.map((g: any) => g.label);
          const values = data.animaisPorLocalizacao.map((g: any) => g.count);
          setBarData({ labels, datasets: [{ ...barData.datasets[0], data: values }] });
        }

        if (data?.tipoRaca) {
          const labels = data.tipoRaca.map((g: any) => g.label);
          const values = data.tipoRaca.map((g: any) => g.count);
          setPieData({ labels, datasets: [{ ...pieData.datasets[0], data: values }] });
        }

        if (data?.animaisPorSexo) {
          const map = { MACHO: 0, FEMEA: 0, INDETERMINADO: 0 };
          for (const s of data.animaisPorSexo) map[s.sexo as keyof typeof map] = s.count;
          setSexoPieData({
            labels: ["Macho", "Fêmea", "Indeterm."],
            datasets: [{ data: [map.MACHO, map.FEMEA, map.INDETERMINADO], backgroundColor: ["#2196F3", "#E91E63", "#9E9E9E"] }],
          });
        }

        setAnimaisDoentes(Number(data?.animaisDoentes ?? 0));
        setTaxaReproducao(Number(data?.taxaReproducao ?? 0));
      } catch (err) {
        console.warn("Não foi possível carregar resumo do dashboard:", err);
      }
    };
    fetchSummary();
  }, [accessToken]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: darkMode ? "#fff" : "#000" } } },
    scales: { x: { ticks: { color: darkMode ? "#fff" : "#000" } }, y: { ticks: { color: darkMode ? "#fff" : "#000" } } },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: darkMode ? "#fff" : "#000" } } },
  };

  if (!mounted) return null;
  // ---------- Layout ----------
  return (
    <div className="p-10">
      {/* Header */}
      <header className="items-start mb-8">
        <h1 className="text-3xl font-title mb-4 text-primary">Dashboard</h1>
        <BreadcrumbArea />
      </header>

      {/* Cards */}
      <div className="w-full mb-10 p-8 rounded-2xl shadow-lg bg-[hsl(var(--dashboard-primary))] text-[hsl(var(--dashboard-primary-foreground))]">
        <div className="flex gap-6 justify-start">
          <div className="flex items-center p-4 rounded-xl shadow-md bg-[hsl(var(--dashboard-primary))] text-[hsl(var(--dashboard-primary-foreground))] w-52 h-24 gap-3">
            <Cross size={30} strokeWidth={2} className="text-[hsl(var(--dashboard-primary-foreground))]" />
            <div className="flex flex-col justify-center flex-1 text-right">
              <h2 className="text-lg font-medium leading-snug">Animais Doentes</h2>
              <p className="text-sm">{animaisDoentes} casos</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-xl shadow-md bg-[hsl(var(--dashboard-primary))] text-[hsl(var(--dashboard-primary-foreground))] w-52 h-24 gap-3">
            <Image src="/images/sperm.svg" alt="Ícone de reprodução" width={30} height={30} />
            <div className="flex flex-col justify-center flex-1 text-right">
              <h2 className="text-lg font-medium leading-snug">
                Taxa de Reprodução <br /> Efetiva
              </h2>
              <p className="text-sm">{taxaReproducao}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais Doentes</h2>
          <div className="h-40 flex justify-center items-center"><Line data={lineData} options={chartOptions} /></div>
        </div>

        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais cadastrados por ano</h2>
          <div className="h-40 flex justify-center items-center"><Line data={areaData} options={chartOptions} /></div>
        </div>

        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais por Localização</h2>
          <div className="h-40 flex justify-center items-center"><Bar data={barData} options={chartOptions} /></div>
        </div>

        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Tipo de Raça</h2>
          <div className="h-64 w-64 mx-auto flex justify-center items-center"><Pie data={pieData} options={pieOptions} /></div>
        </div>

        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Distribuição por Sexo</h2>
          <div className="h-64 w-64 mx-auto flex justify-center items-center"><Pie data={sexoPieData} options={pieOptions} /></div>
        </div>

        <div className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
          <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Vacinas aplicadas (por mês)</h2>
          <div className="h-40"><Bar data={vacinasBarData} options={chartOptions} /></div>
        </div>
      </div>
    </div>
  );
}
