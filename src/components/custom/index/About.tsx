import React from 'react';
import {Button} from "@/components/ui/button";
import Link from "next/link";

const About: React.FC = () => {
    return (
        <section
            id="sobre"
            aria-labelledby="sobre-title"
            className="py-16 md:py-24 bg-gradient-to-b from-secondary/60 to-secondary"
        >
                <div className="max-w-4xl mx-auto grid gap-8 items-center">
                    <div className="bg-primary p-8 md:p-10 rounded-2xl shadow-lg">
                        <h2 id="sobre-title" className="text-3xl md:text-4xl font-extrabold mb-3 text-primary-foreground">
                            Sobre a CowUai
                        </h2>
                        <p className="text-lg leading-relaxed text-primary-foreground/90 mb-6 text-justify">
                            A CowUai é uma plataforma que simplifica a gestão de fazendas de gado. Unimos tecnologia e
                            experiência no campo para oferecer ferramentas que aumentam a produtividade, monitoram a saúde
                            do rebanho e suportam decisões baseadas em dados confiáveis.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-center align-middle gap-3">
                                <span className="flex-none w-10 h-10 rounded-full bg-accent text-primary inline-flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                <span className="text-primary-foreground/85">Monitoramento e histórico detalhado do rebanho</span>
                            </li>

                            <li className="flex items-center align-middle gap-3">
                                <span className="flex-none w-10 h-10 rounded-full bg-accent text-primary inline-flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                <span className="text-primary-foreground/85">Fluxos práticos para otimizar o dia a dia na fazenda</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <Button asChild variant="outline" className="text-lg text-primary px-6 py-3 rounded-md shadow-sm">
                                <Link href="/cadastro">Comece agora!</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;