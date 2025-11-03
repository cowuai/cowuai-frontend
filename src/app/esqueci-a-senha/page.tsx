'use client';

import React from "react";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function EsqueciASenhaPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar o link de recuperação de senha
        console.log("Enviar link de recuperação para:", email);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            if (res.ok) {
                toast.success("Instruções para redefinição de senha enviadas para o email.", {
                    duration: 5000,
                    richColors: true,
                    closeButton: true,
                });
                router.push("/login");
            } else {
                const errorText = await res.text();
                toast.error(`Erro ao enviar email: ${res.status} ${errorText}`);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            toast.error("Não foi possível enviar o email de recuperação.");
        }
    };

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen"}>
            <div className={"flex flex-col w-full max-w-md p-8 bg-white rounded-lg shadow-md gap-6"}>
                <h1 className={"font-tsukimi-rounded text-3xl text-primary"}>Esqueci a Senha</h1>
                <form className={"flex flex-col gap-4"} onSubmit={handleSubmit}>
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    <Button type="submit" disabled={!email.trim()}>Enviar Link de Recuperação</Button>
                </form>

                <Link href={"/login"} className={"mt-4 text-sm text-primary hover:underline"}>
                    Voltar ao Login
                </Link>
            </div>
        </div>
    );
}