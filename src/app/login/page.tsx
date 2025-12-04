'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/app/providers/AuthProvider';
import {toast} from 'sonner';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const {login} = useAuth();
    const router = useRouter();

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: '', password: ''},
        mode: 'onSubmit',
    });

    async function onSubmit(values: LoginForm) {
        try {
            const success = await login(values.email, values.password);
            if (success) {
                router.push('/auth/dashboard');
            } else {
                toast.error('Falha no login', {description: 'Verifique suas credenciais.'});
            }
        } catch (err: any) {
            console.error('Erro no login:', err);
            toast.error(err?.message || 'Erro inesperado ao fazer login');
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen transition-colors duration-500 px-4">
            <div
                className="flex flex-col md:flex-row w-full max-w-4xl md:h-[500px] rounded-lg overflow-hidden shadow-lg">
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
                <div
                    className="flex flex-col items-center justify-center md:w-1/2 w-full bg-red-900 text-white p-6 md:p-8">
                    <h2 className="text-3xl font-title mb-6">Login</h2>

                    <div className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-md">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                // agrega mensagens e mostra toast
                                const issues = Object.values(errors)
                                    .map((e: any) => e?.message)
                                    .filter(Boolean)
                                    .join(' - ');
                                if (issues) toast.error(issues);
                            })}
                        >
                            <div>
                                <label className="text-sm font-medium">E-mail</label>
                                <input
                                    {...form.register('email')}
                                    name="email"
                                    type="email"
                                    placeholder={'Email'}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Senha</label>
                                    <Link href="/esqueci-a-senha/-" className="text-sm text-red-900 hover:underline">
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                                <input
                                    {...form.register('password')}
                                    name="password"
                                    type="password"
                                    placeholder={'Senha'}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                                />
                                {form.formState.errors.password && (
                                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.password.message}</p>
                                )}
                            </div>

                            <button type="submit"
                                    className="bg-red-900 text-white py-2 rounded-lg hover:bg-red-800 transition w-full">
                                Login
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition w-full"
                                onClick={() => {
                                    window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
                                }}
                            >
                                Faça login com o Google
                                <Image src="/images/google-icon.png" alt="Google" width={20} height={20}/>
                            </button>
                        </form>

                        <p className="text-sm text-center mt-4">
                            Não possui uma conta?{' '}
                            <Link href="/cadastro" className="text-red-900 hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>

                    <Link href={'/'} className={'mt-4 text-sm text-white hover:underline'}>
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </main>
    );
}
