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
import {PiMoneyWavy, PiFarm} from "react-icons/pi";

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
    const [doencasBarData, setDoencasBarData] = useState<any>({labels: [], datasets: []});

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

                // Doenças ativas por fazenda
                if (data.doencasPorFazenda && Array.isArray(data.doencasPorFazenda) && data.doencasPorFazenda.length > 0) {
                    setDoencasBarData({
                        labels: data.doencasPorFazenda.map((d: any) => d.doenca?.nome ?? d.doenca?.nome ?? "Desconhecida"),
                        datasets: [{
                            label: 'Casos ativos por doença',
                            data: data.doencasPorFazenda.map((d: any) => d.count),
                            backgroundColor: ['#f97316', '#06b6d4', '#7c3aed', '#ef4444', '#10b981'],
                        }],
                    });
                }

                // Se houver dados de doenças por fazenda, garantir que o total de "animais doentes"
                // reflita a soma dos casos por doença (para manter os gráficos consistentes).
                if (data.doencasPorFazenda && Array.isArray(data.doencasPorFazenda)) {
                    const totalDoencasCount = data.doencasPorFazenda.reduce((sum: number, d: any) => {
                        const c = Number(d.count ?? 0);
                        return sum + (Number.isNaN(c) ? 0 : c);
                    }, 0);

                    if (totalDoencasCount > 0) {
                        // Atualiza o estado principal e o gráfico de linha para refletir o total calculado
                        setAnimaisDoentes(totalDoencasCount);
                        setLineData({
                            labels: ["Total"],
                            datasets: [{
                                label: "Animais Doentes",
                                data: [totalDoencasCount],
                                borderColor: "#EF4444",
                                backgroundColor: "transparent",
                                tension: 0.4,
                                borderWidth: 2,
                            }],
                        });
                    }
                }

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
                className="w-full mb-8 p-6 md:p-8 rounded-2xl shadow-lg bg-[hsl(var(--dashboard-primary))] text-[hsl(var(--dashboard-primary-foreground))]"
            >
                <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      md:grid-cols-3
                      lg:grid-cols-4
                      xl:grid-cols-5
                      gap-6
                    "
                >
                    {/* Card base */}
                    {[
                        {
                            title: "Animais Doentes",
                            value: `${animaisDoentes} casos`,
                            icon: <Cross size={30} strokeWidth={2}/>,
                        },
                        {
                            title: "Total de Animais\nNo Sistema",
                            value: totalAnimais,
                            icon: <PiCow size={35} strokeWidth={0.5}/>,
                        },
                        {
                            title: "Total de Animais\nCom Registro",
                            value: totalAnimaisComRegistro,
                            icon: <PiCertificate size={35} strokeWidth={0.5}/>,
                        },
                        {
                            title: "Total de Animais\nVendidos",
                            value: totalAnimaisVendidos,
                            icon: <PiMoneyWavy size={35} strokeWidth={0.5}/>,
                        },
                        {
                            title: "Total de Fazendas\nDo Criador",
                            value: totalFazendasDoCriador,
                            icon: <PiFarm size={35} strokeWidth={0.5}/>,
                        }
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="
                              flex items-center gap-4
                              p-4 rounded-xl shadow-md
                              bg-dashboard
                              text-[hsl(var(--dashboard-primary-foreground))]
                              h-32
                            "
                        >
                            <div className="text-[hsl(var(--dashboard-primary-foreground))]">
                                {card.icon}
                            </div>
                            <div className="flex flex-col flex-1 text-right leading-snug">
                                <h2 className="text-base font-medium whitespace-pre-line">
                                    {card.title}
                                </h2>
                                <p className="text-sm">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais Doentes</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center">
                        <Line data={lineData} options={chartOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais cadastrados
                        por ano</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center">
                        <Line data={areaData} options={chartOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Animais por
                        Localização</h2>
                    <div className="h-44 sm:h-56 lg:h-40 flex justify-center items-center">
                        <Bar data={barData} options={chartOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Tipo de Raça</h2>
                    <div className="h-64 w-full max-w-xs mx-auto flex justify-center items-center">
                        <Pie data={pieData} options={pieOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Distribuição por
                        Sexo</h2>
                    <div className="h-64 w-full max-w-xs mx-auto flex justify-center items-center"><Pie
                        data={sexoPieData}
                        options={pieOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Vacinas aplicadas
                        (por mês)</h2>
                    <div className="h-64 sm:h-56 lg:h-40 flex justify-center items-center">
                        <Bar data={vacinasBarData} options={chartOptions}/>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-xl shadow transition-colors duration-500 ${darkMode ? "bg-stone-950" : "bg-white"}`}>
                    <h2 className={`text-center mb-2 ${darkMode ? "text-white" : "text-red-800"}`}>Doenças Ativas</h2>
                    <div className="h-44 sm:h-56 lg:h-40 mx-auto flex justify-center items-center">
                        {doencasBarData?.datasets && doencasBarData.datasets.length > 0 ? (
                            <Bar data={doencasBarData} options={chartOptions}/>
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                                Nenhuma doença ativa encontrada para suas fazendas.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
