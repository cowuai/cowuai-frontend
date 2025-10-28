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
  const { accessToken } = useAuth();
  const darkMode = theme === "dark";
  const [mounted, setMounted] = useState(false);

  // ---------- States dos gráficos ----------
  const [animaisDoentes, setAnimaisDoentes] = useState(0);
  const [taxaReproducao, setTaxaReproducao] = useState(0);

  const [lineData, setLineData] = useState<any>({ labels: ["Total"], datasets: [] });
  const [areaData, setAreaData] = useState<any>({ labels: [], datasets: [] });
  const [barData, setBarData] = useState<any>({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState<any>({ labels: [], datasets: [] });
  const [sexoPieData, setSexoPieData] = useState<any>({ labels: ["Macho", "Fêmea", "Indeterm."], datasets: [] });
  const [vacinasBarData, setVacinasBarData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => setMounted(true), []);

  // ---------- Fetch do dashboard ----------
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!accessToken) return;
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const res = await fetch(`${base}/dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Animais doentes
        setAnimaisDoentes(Number(data.animaisDoentes ?? 0));
        setLineData({
          labels: ["Total"],
          datasets: [{
            label: "Animais Doentes",
            data: [Number(data.animaisDoentes ?? 0)],
            borderColor: "#EF4444",
            backgroundColor: "transparent",
            tension: 0.4,
            borderWidth: 2,
          }],
        });

        // Taxa de reprodução
        setTaxaReproducao(Number(data.taxaReproducao ?? 0));

        // Área (animais por ano) - se houver
        if (data.animaisPorAno) {
          setAreaData({
            labels: data.animaisPorAno.map((a: any) => a.ano),
            datasets: [{
              label: "Animais cadastrados (por ano)",
              data: data.animaisPorAno.map((a: any) => a.count),
              fill: true,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              borderColor: "#10B981",
              tension: 0.3,
              borderWidth: 2,
            }],
          });
        }

        // Animais por localização
        setBarData({
          labels: data.animaisPorLocalizacao.map((a: any) => a.label),
          datasets: [{
            label: "Animais",
            data: data.animaisPorLocalizacao.map((a: any) => a.count),
            backgroundColor: ["#FF5722", "#009688", "#006064"],
          }],
        });

        // Tipo de raça
        setPieData({
          labels: data.tipoRaca.map((r: any) => r.label),
          datasets: [{
            data: data.tipoRaca.map((r: any) => r.count),
            backgroundColor: ["#FF5722", "#009688", "#006064"],
            borderWidth: 0,
          }],
        });

        // Animais por sexo
        const sexoMap = { MACHO: 0, FEMEA: 0, INDETERMINADO: 0 };
        data.animaisPorSexo.forEach((s: any) => {
          if (s.sexo === "MACHO") sexoMap.MACHO = s.count;
          else if (s.sexo === "FEMEA") sexoMap.FEMEA = s.count;
          else sexoMap.INDETERMINADO = s.count;
        });
        setSexoPieData({
          labels: ["Macho", "Fêmea", "Indeterm."],
          datasets: [{ data: [sexoMap.MACHO, sexoMap.FEMEA, sexoMap.INDETERMINADO], backgroundColor: ["#2196F3", "#E91E63", "#9E9E9E"] }],
        });

        // Vacinas aplicadas
        setVacinasBarData({
          labels: data.vacinacoesPorMes.map((v: any) => v.label),
          datasets: [{
            label: "Vacinas aplicadas",
            data: data.vacinacoesPorMes.map((v: any) => v.count),
            backgroundColor: "#9C27B0",
          }],
        });

      } catch (err) {
        console.warn("Erro ao carregar dashboard:", err);
      }
    };

    fetchDashboard();
  }, [accessToken]);

  // ---------- Chart options ----------
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
          <div className="flex items-center p-4 rounded-xl shadow-md w-52 h-24 gap-3">
            <Cross size={30} strokeWidth={2} className="text-[hsl(var(--dashboard-primary-foreground))]" />
            <div className="flex flex-col justify-center flex-1 text-right">
              <h2 className="text-lg font-medium leading-snug">Animais Doentes</h2>
              <p className="text-sm">{animaisDoentes} casos</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-xl shadow-md w-52 h-24 gap-3">
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
