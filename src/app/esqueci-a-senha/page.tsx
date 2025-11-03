'use client';

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";

// Schema de validação para email
const emailSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: "Email inválido" })
        .max(255, { message: "Email deve ter menos de 255 caracteres" }),
});

// Schema de validação para reset de senha
const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
            .max(100, { message: "A senha deve ter menos de 100 caracteres" })
            .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula" })
            .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula" })
            .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

const ForgotPassword = () => {
    const { token } = useParams<{ token?: string }>();
    const router = useRouter();
    const [isResetMode, setIsResetMode] = useState(false);

    // Estado para modo de solicitação de link
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Estado para modo de reset
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // Detecta se há token na URL
    useEffect(() => {
        setIsResetMode(!!token);
    }, [token]);

    // Validação de email em tempo real
    const validateEmail = (value: string) => {
        try {
            emailSchema.parse({ email: value });
            setEmailError("");
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstIssue = error.issues?.[0];
                setEmailError(firstIssue?.message ?? "Email inválido");
            }
            return false;
        }
    };

    // Validação de senha em tempo real
    const validatePasswords = () => {
        try {
            resetPasswordSchema.parse({ password, confirmPassword });
            setPasswordError("");
            setConfirmPasswordError("");
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.issues.forEach((err: z.ZodIssue) => {
                    const path = err.path?.map(String) ?? [];
                    if (path.includes("password") && !path.includes("confirmPassword")) {
                        setPasswordError(err.message);
                    } else if (path.includes("confirmPassword")) {
                        setConfirmPasswordError(err.message);
                    }
                });
            }
            return false;
        }
    };

    // Handler para solicitar link de recuperação
    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                toast.success("Link de recuperação enviado!", {
                    description: "Verifique seu email para redefinir sua senha.",
                    duration: 5000,
                });
                setEmail("");
            } else {
                const errorText = await res.text();
                toast.error("Erro ao enviar email", {
                    description: errorText || "Tente novamente mais tarde.",
                });
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            toast.error("Não foi possível enviar o email de recuperação.", {
                description: "Verifique sua conexão e tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handler para resetar senha
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulação de API call - substituir pela sua API real
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                toast.success("Senha redefinida com sucesso!", {
                    description: "Você já pode fazer login com sua nova senha.",
                    duration: 5000,
                });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                const errorText = await res.text();
                toast.error("Erro ao redefinir senha", {
                    description: errorText || "O link pode ter expirado. Solicite um novo.",
                });
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            toast.error("Não foi possível redefinir a senha.", {
                description: "Verifique sua conexão e tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center gradient-bg px-4 py-8">
            <div className="w-full max-w-md">
                <div className="card-elegant rounded-2xl bg-card p-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                    {/* Cabeçalho */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            {isResetMode ? (
                                <Lock className="h-8 w-8 text-primary" />
                            ) : (
                                <KeyRound className="h-8 w-8 text-primary" />
                            )}
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-card-foreground">
                            {isResetMode ? "Redefinir Senha" : "Esqueceu a Senha?"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isResetMode
                                ? "Escolha uma nova senha segura para sua conta"
                                : "Não se preocupe, vamos te ajudar a recuperar o acesso"}
                        </p>
                    </div>

                    {/* Formulário de Solicitação de Link */}
                    {!isResetMode && (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="seu@email.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (emailError) validateEmail(e.target.value);
                                        }}
                                        onBlur={() => validateEmail(email)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-sm text-destructive">{emailError}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !email.trim() || !!emailError}
                            >
                                {isLoading ? (
                                    "Enviando..."
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Link de Recuperação
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Formulário de Reset de Senha */}
                    {isResetMode && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Nova Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (passwordError || confirmPasswordError) {
                                                setPasswordError("");
                                                setConfirmPasswordError("");
                                            }
                                        }}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {passwordError && (
                                    <p className="text-sm text-destructive">{passwordError}</p>
                                )}
                                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                    <li className="flex items-center gap-1">
                                        <CheckCircle2 className={`h-3 w-3 ${password.length >= 8 ? 'text-green-500' : ''}`} />
                                        Mínimo de 8 caracteres
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <CheckCircle2 className={`h-3 w-3 ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`} />
                                        Uma letra maiúscula
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <CheckCircle2 className={`h-3 w-3 ${/[a-z]/.test(password) ? 'text-green-500' : ''}`} />
                                        Uma letra minúscula
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <CheckCircle2 className={`h-3 w-3 ${/[0-9]/.test(password) ? 'text-green-500' : ''}`} />
                                        Um número
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirmar Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (confirmPasswordError) setConfirmPasswordError("");
                                        }}
                                        onBlur={validatePasswords}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {confirmPasswordError && (
                                    <p className="text-sm text-destructive">{confirmPasswordError}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !password || !confirmPassword || !!passwordError || !!confirmPasswordError}
                            >
                                {isLoading ? (
                                    "Redefinindo..."
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Redefinir Senha
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Link de Voltar */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm text-primary transition-colors hover:text-primary/80"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Voltar ao Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;