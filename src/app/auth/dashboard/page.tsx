"use client";

import Image from "next/image";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Line, Bar, Pie} from "react-chartjs-2";
import {useAuth} from "@/app/providers/AuthProvider";
import {Cross} from "lucide-react";
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
import {PiCertificate, PiCow} from "react-icons/pi";
import { PiMoneyWavy, PiFarm } from "react-icons/pi";

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
    const {theme} = useTheme();
    const {accessToken} = useAuth();
    const darkMode = theme === "dark";

    // ---------- States dos gráficos ----------
    const [animaisDoentes, setAnimaisDoentes] = useState(0);
    const [taxaReproducao, setTaxaReproducao] = useState(0);
    const [totalAnimais, setTotalAnimais] = useState(0);
    const [totalAnimaisComRegistro, setTotalAnimaisComRegistro] = useState(0);
    const [totalAnimaisVendidos, setTotalAnimaisVendidos] = useState(0);
    const [totalFazendasDoCriador, setTotalFazendasDoCriador] = useState(0);

    const [lineData, setLineData] = useState<any>({labels: ["Total"], datasets: []});
    const [areaData, setAreaData] = useState<any>({labels: [], datasets: []});
    const [barData, setBarData] = useState<any>({labels: [], datasets: []});
    const [pieData, setPieData] = useState<any>({labels: [], datasets: []});
    const [sexoPieData, setSexoPieData] = useState<any>({labels: ["Macho", "Fêmea", "Indeterm."], datasets: []});
    const [vacinasBarData, setVacinasBarData] = useState<any>({labels: [], datasets: []});

    // ---------- Fetch do dashboard ----------
    useEffect(() => {
        const fetchDashboard = async () => {
            if (!accessToken) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
                    headers: {Authorization: `Bearer ${accessToken}`},
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Erro ao buscar dados do dashboard");
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

                // Total de animais cadastrados
                setTotalAnimais(Number(data.totalAnimais ?? 0));

                // Total de animais com registro
                setTotalAnimaisComRegistro(Number(data.totalAnimaisComRegistro ?? 0));

                // Total de animais vendidos
                setTotalAnimaisVendidos(Number(data.totalAnimaisVendidos ?? 0));

                // Total de fazendas do criador
                setTotalFazendasDoCriador(Number(data.totalFazendasDoCriador ?? 0));

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
                const sexoMap = {MACHO: 0, FEMEA: 0, INDETERMINADO: 0};
                data.animaisPorSexo.forEach((s: any) => {
                    if (s.sexo === "MACHO") sexoMap.MACHO = s.count;
                    else if (s.sexo === "FEMEA") sexoMap.FEMEA = s.count;
                    else sexoMap.INDETERMINADO = s.count;
                });
                setSexoPieData({
                    labels: ["Macho", "Fêmea", "Indeterm."],
                    datasets: [{
                        data: [sexoMap.MACHO, sexoMap.FEMEA, sexoMap.INDETERMINADO],
                        backgroundColor: ["#2196F3", "#E91E63", "#9E9E9E"]
                    }],
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
        plugins: {legend: {labels: {color: darkMode ? "#fff" : "#000"}}},
        scales: {x: {ticks: {color: darkMode ? "#fff" : "#000"}}, y: {ticks: {color: darkMode ? "#fff" : "#000"}}},
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {labels: {color: darkMode ? "#fff" : "#000"}}},
    };

    // ---------- Layout ----------
    return (
        <div className="p-6 md:p-10">
            {/* Header */}
            <header className="items-start mb-8">
                <h1 className="text-3xl font-title mb-4 text-primary">Dashboard</h1>
                <BreadcrumbArea/>
            </header>

            {/* Cards */}
            <div
                className="w-full mb-8 p-6 md:p-8 rounded-2xl shadow-lg bg-[hsl(var(--dashboard-primary))] text-[hsl(var(--dashboard-primary-foreground))]">
                <div className="flex flex-wrap gap-4 justify-start">
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <Cross size={30} strokeWidth={2} className="text-[hsl(var(--dashboard-primary-foreground))]"/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">Animais Doentes</h2>
                            <p className="text-sm">{animaisDoentes} casos</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <Image src="/images/sperm.svg" alt="Ícone de reprodução" width={35} height={35}/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">
                                Taxa de Reprodução <br/> Efetiva
                            </h2>
                            <p className="text-sm">{taxaReproducao}%</p>
                        </div>
                    </div>
                    {/* Total de Animais do Criador no Sistema */}
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <PiCow size={35} strokeWidth={0.5}/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">
                                Total de Animais <br/> No Sistema
                            </h2>
                            <p className="text-sm"> {totalAnimais}</p>
                        </div>
                    </div>
                    {/* Total de Animais com Registro */}
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <PiCertificate size={35} strokeWidth={0.5}/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">
                                Total de Animais <br/> Com Registro
                            </h2>
                            <p className="text-sm"> {totalAnimaisComRegistro}</p>
                        </div>
                    </div>
                    {/* Total de Animais Vendidos */}
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <PiMoneyWavy size={35} strokeWidth={0.5}/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">
                                Total de Animais <br/> Vendidos
                            </h2>
                            <p className="text-sm"> {totalAnimaisVendidos}</p>
                        </div>
                    </div>
                    {/* Total de Fazendas do Criador */}
                    <div className="flex items-center p-4 rounded-xl shadow-md w-full sm:w-56 md:w-52 h-20 sm:h-24 gap-3">
                        <PiFarm size={35} strokeWidth={0.5}/>
                        <div className="flex flex-col justify-center flex-1 text-right">
                            <h2 className="text-lg font-medium leading-snug">
                                Total de Fazendas <br/> Do Criador
                            </h2>
                            <p className="text-sm"> {totalFazendasDoCriador}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais Doentes</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center"><Line data={lineData}
                                                                                                     options={chartOptions}/></div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais cadastrados
                        por ano</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center"><Line data={areaData}
                                                                                                     options={chartOptions}/></div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais por
                        Localização</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center"><Bar data={barData} options={chartOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Tipo de Raça</h2>
                    <div className="h-64 w-full max-w-xs mx-auto flex justify-center items-center"><Pie data={pieData}
                                                                                                     options={pieOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Distribuição por
                        Sexo</h2>
                    <div className="h-64 w-full max-w-xs mx-auto flex justify-center items-center"><Pie data={sexoPieData}
                                                                                                     options={pieOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Vacinas aplicadas
                        (por mês)</h2>
                    <div className="h-44 sm:h-56 lg:h-40"><Bar data={vacinasBarData} options={chartOptions}/></div>
                </div>
            </div>
        </div>
    );
}
