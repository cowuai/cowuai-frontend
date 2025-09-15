"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PlusCircle, KeyRound } from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Cross } from "lucide-react"; //cruz do card de animais doentes
import { GiSeedling } from "react-icons/gi"; //vaso com planta do card de taxa de reprodução efetiva

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
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const darkMode = theme === "dark";

  // ---------------- Dados dos gráficos ----------------
  const lineData = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril"],
    datasets: [
      {
        label: "Natalidade",
        data: [10, 20, 15, 25],
        borderColor: darkMode ? "#818CF8" : "#3B82F6",
        backgroundColor: "transparent",
      },
      {
        label: "Mortalidade",
        data: [5, 10, 8, 12],
        borderColor: darkMode ? "#F472B6" : "#EF4444",
        backgroundColor: "transparent",
      },
    ],
  };

  const areaData = {
    labels: ["Jan", "Fev", "Mar", "Abr"],
    datasets: [
      {
        label: "Gastos com Ração",
        data: [500, 700, 650, 800],
        fill: true,
        backgroundColor: darkMode
          ? "rgba(99, 102, 241, 0.3)"
          : "rgba(59, 130, 246, 0.3)",
        borderColor: darkMode ? "#6366F1" : "#3B82F6",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: ["Bovinos", "Suínos", "Caprinos", "Aves", "Outros"],
    datasets: [
      {
        label: "Animais",
        data: [50, 35, 30, 25, 15],
        backgroundColor: [
          "#FF5722",
          "#009688",
          "#006064",
          "#FFC107",
          "#FF9800",
        ],
      },
    ],
  };

  const pieData = {
    labels: ["Bovinos", "Suínos", "Caprinos", "Aves", "Outros"],
    datasets: [
      {
        data: [60, 40, 35, 30, 15],
        backgroundColor: [
          "#FF5722",
          "#009688",
          "#006064",
          "#FFC107",
          "#FF9800",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: darkMode ? "#fff" : "#000" } },
    },
    scales: {
      x: { ticks: { color: darkMode ? "#fff" : "#000" } },
      y: { ticks: { color: darkMode ? "#fff" : "#000" } },
    },
  };

  //Opções específicas do gráfico de pizza
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: darkMode ? "#fff" : "#000" } },
    },
  };

  // ---------------- Layout ----------------
  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-stone-900 text-stone-100" : "bg-white text-stone-950"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 p-6 flex flex-col justify-between shadow-lg transition-colors duration-500 ${
          darkMode ? "bg-stone-950" : "bg-stone-50"
        }`}
      >
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/images/cowuai-logo.png"
              alt="CowUai Logo"
              width={100}
              height={100}
            />
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
                darkMode
                  ? "hover:bg-stone-800 text-stone-100"
                  : "hover:bg-stone-200 text-stone-950"
              }`}
            >
              Dashboard
            </Link>

            <details className="group">
              <summary
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
                  darkMode
                    ? "hover:bg-stone-800 text-stone-100"
                    : "hover:bg-stone-200 text-stone-950"
                }`}
              >
                Animais
              </summary>
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li>
                  <Link href="#">Cadastrar Animal</Link>
                </li>
                <li>
                  <Link href="#">Atualizar Animal</Link>
                </li>
                <li>
                  <Link href="#">Excluir Animal</Link>
                </li>
                <li>
                  <Link href="#">Visualizar Animal</Link>
                </li>
              </ul>
            </details>

            <Link
              href="#"
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
                darkMode
                  ? "hover:bg-stone-800 text-stone-100"
                  : "hover:bg-stone-200 text-stone-950"
              }`}
            >
              Gerenciar Fazenda
            </Link>
          </nav>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-10 transition-colors duration-500">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <h1 className="text-3xl text-red-900 font-title mb-6">Dashboard</h1>

          <div className="flex items-center gap-4 mt-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-400">
              <Image
                src="/images/user-photo.png"
                alt="Foto do usuário"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Card principal */}
        <div className="w-full mb-10 p-8 rounded-2xl shadow-lg bg-gradient-to-r from-orange-600/60 to-orange-600/60">
          <div className="flex gap-6 justify-start">
            {/* Card Animais Doentes */}
            <div className="flex items-center p-4 rounded-xl shadow-md bg-orange-600/20 text-white w-52 h-24 gap-3">
              <Cross size={30} strokeWidth={2} className="text-white" />
              <div className="flex flex-col justify-center flex-1 text-right">
                <h2 className="text-lg font-medium leading-snug">
                  Animais Doentes
                </h2>
                <p className="text-sm">13 casos</p>
              </div>
            </div>

            {/* Card Taxa Reprodução Efetiva */}
            <div className="flex items-center p-4 rounded-xl shadow-md bg-orange-600/20 text-white w-52 h-24 gap-3">
              <GiSeedling size={30} className="text-white" />
              <div className="flex flex-col justify-center flex-1 text-right">
                <h2 className="text-lg font-medium leading-snug">
                  Taxa de Reprodução <br />
                  Efetiva
                </h2>
                <p className="text-sm">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Natalidade/Mortalidade */}
          <div
            className={`p-6 rounded-xl shadow transition-colors duration-500 ${
              darkMode ? "bg-stone-950" : "bg-white"
            }`}
          >
            <h2 className="text-center text-red-800 mb-2">
              Taxa de Natalidade e Mortalidade da Fazenda
            </h2>
            <div className="h-40 flex justify-center items-center">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Gastos Ração */}
          <div
            className={`p-6 rounded-xl shadow transition-colors duration-500 ${
              darkMode ? "bg-stone-950" : "bg-white"
            }`}
          >
            <h2 className="text-center text-red-800 mb-2">
              Gastos com Ração Mensalmente
            </h2>
            <div className="h-40 flex justify-center items-center">
              <Line data={areaData} options={chartOptions} />
            </div>
          </div>

          {/* Animais por Setor */}
          <div
            className={`p-6 rounded-xl shadow transition-colors duration-500 ${
              darkMode ? "bg-stone-950" : "bg-white"
            }`}
          >
            <h2 className="text-center text-red-800 mb-2">Animais por Setor</h2>
            <div className="h-40 flex justify-center items-center">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          {/* Tipos de Criações na Fazenda */}
          <div
            className={`col-span-2 lg:col-span-1 p-6 rounded-xl shadow transition-colors duration-500 ${
              darkMode ? "bg-stone-950" : "bg-white"
            }`}
          >
            <h2 className="mb-2 text-center text-red-800">
              Tipos de Criações na Fazenda
            </h2>
            <div className="h-64 w-64 mx-auto flex justify-center items-center">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
