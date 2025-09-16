"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Cross } from "lucide-react"; //cruz do card de animais doentes
import { GiSeedling } from "react-icons/gi"; //vaso com planta do card de taxa de reprodução efetiva
import { PiCow } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { PiKeyReturn } from "react-icons/pi";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

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
  const [sidebarOpen, setSidebarOpen] = useState(true); //estado para abrir e fechar sidebar
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
        borderColor: darkMode ? "#10B981" : "#10B981",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Mortalidade",
        data: [5, 10, 8, 12],
        borderColor: darkMode ? "#F97316" : "#F97316",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const areaData = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril"],
    datasets: [
      {
        label: "Gastos com Ração",
        data: [500, 700, 650, 800],
        fill: true,
        backgroundColor: darkMode
          ? "rgba(243, 151, 75, 0.3)"
          : "rgba(243, 151, 75, 0.3)",
        borderColor: darkMode ? "#F97316" : "#F97316",
        tension: 0.3,
        borderWidth: 2,
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); //função para abrir e fechar sidebar 

  // ---------------- Layout ----------------
  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-stone-900 text-stone-100" : "bg-white text-stone-950"
      }`}
    >
    {/* Sidebar */}
  <aside
    className={`flex flex-col justify-between shadow-lg transition-all duration-300 ${
      darkMode ? "bg-stone-950" : "bg-stone-50"
    } ${sidebarOpen ? "w-64 p-6" : "w-20 p-2"}`} //largura muda
  >
    <div>
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-10">
        <Image
          src="/images/cowuai-logo.png"
          alt="CowUai Logo"
          width={sidebarOpen ? 100 : 40} //logo diminui ao recolher
          height={sidebarOpen ? 100 : 40}
        />
        <PiKeyReturn
          size={30}
          className="text-red-600 cursor-pointer"
          onClick={toggleSidebar} //função para recolher a sidebar
        />
      </div>

      {/* Navegação */}
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
            darkMode
          ? "bg-white border border-white text-stone-950"
          : "hover:bg-red-200 text-stone-950" 
          }`}
        >
          <LuLayoutDashboard size={20} className="text-red-600" />
          {sidebarOpen && <span>Dashboard</span>}
        </Link>

        <details className="group">
          <summary
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
              darkMode
            ? "bg-white border border-white text-stone-950"
            : "hover:bg-red-200 text-stone-950" 
            }`}
          >
            <PiCow size={20} className="text-red-600" />
            {sidebarOpen && <span>Gerenciar Animais</span>}
          <FaChevronRight
            className="transition-transform duration-300 group-open:rotate-90 text-red-600" 
          />
          </summary>
          {sidebarOpen && (
            <ul className="mt-2 space-y-1 text-md bg-white border border-white rounded-md p-2">
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Cadastrar Animal</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Atualizar Animal</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Excluir Animal</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Visualizar Animal</Link>
            </li>
          </ul>
          )}
        </details>

        <details className="group">
        <summary
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-500 ${
            darkMode
              ? "bg-white border border-white text-stone-950"
              : "hover:bg-red-200 text-stone-950"
          }`}
        >
          <PiUsersThree size={20} className="text-red-600" />
          {sidebarOpen && <span>Gerenciar Fazenda</span>}
          <FaChevronRight
            className="transition-transform duration-300 group-open:rotate-90 text-red-600" 
          />
        </summary>
        {sidebarOpen && (
          <ul className="mt-2 space-y-1 text-md bg-white border border-white rounded-md p-2">
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Cadastrar Fazenda</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Atualizar Fazenda</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Excluir Fazenda</Link>
            </li>
            <li className="hover:bg-red-200 rounded-md px-2 py-1">
              <Link href="#">Visualizar Fazenda</Link>
            </li>
          </ul>
        )}
</details>

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
            <Image
              src="/images/sperm.svg"
              alt="Ícone de reprodução"
              width={30}
              height={30}
            />
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
            className={`lg:col-start-3 p-6 rounded-xl shadow transition-colors duration-500 ${
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
