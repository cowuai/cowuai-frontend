'use client';

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {useAuth} from "@/app/providers/AuthProvider";

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAccessToken } = useAuth();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");

        if (accessToken) {
            // Salva no contexto de autenticação
            setAccessToken(accessToken);

            // Força um refresh ou redireciona
            router.push("/auth/dashboard");
        } else {
            router.push("/login?error=auth_failed");
        }
    }, [searchParams, router, setAccessToken]);

    return <div>Processando login...</div>;
}

export default function AuthCallbackPage() {
    return (
        // ‘Suspense’ é necessário no Next.js App Router ao usar useSearchParams
        <Suspense fallback={<div>Carregando...</div>}>
            <AuthContent />
        </Suspense>
    );
}