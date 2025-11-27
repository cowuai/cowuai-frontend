'use client';

import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/app/providers/AuthProvider";
import {toast} from "sonner";

export default function LoginPage() {
    const {login} = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError("");

        const success = await login(email, senha);
        if (success) {
            router.push("/auth/dashboard");
        } else {
            setError("Falha no login");
        }
    };

    React.useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Verifique suas credenciais e tente novamente.",
                duration: 5000,
                richColors: true,
                closeButton: true,
            });
        }
    }, [error]);

    return (
        <main className="flex items-center justify-center min-h-screen transition-colors duration-500 px-4">
            <div className="flex flex-col md:flex-row w-full max-w-4xl md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                {/* Coluna esquerda */}
                <div className="flex items-center justify-center md:w-1/2 w-full bg-white p-6">
                    <Image
                        src="/images/cowuai-logo.png"
                        alt="CowUai Logo"
                        width={300}
                        height={300}
                        className="object-contain max-w-[260px] w-full h-auto"
                    />
                </div>

                {/* Coluna direita */}
                <div className="flex flex-col items-center justify-center md:w-1/2 w-full bg-red-900 text-white p-6 md:p-8">
                    <h2 className="text-3xl font-title mb-6">Login</h2>

                    <div className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-md">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-sm font-medium">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder={"Email"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Senha</label>
                                    <Link href="/esqueci-a-senha/-" className="text-sm text-red-900 hover:underline">
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                                <input
                                    name="senha"
                                    type="password"
                                    placeholder={"Senha"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-red-900 text-white py-2 rounded-lg hover:bg-red-800 transition w-full"
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition w-full"
                            >
                                Faça login com o Google
                                <Image
                                    src="/images/google-icon.png"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </form>

                        <p className="text-sm text-center mt-4">
                            Não possui uma conta?{" "}
                            <Link href="/cadastro" className="text-red-900 hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                    
                    <Link href={"/"} className={"mt-4 text-sm text-white hover:underline"}>
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </main>
    );
}
