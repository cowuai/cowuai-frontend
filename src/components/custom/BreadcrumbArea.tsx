import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage, // 1. Importe o BreadcrumbPage
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";

const NON_CLICKABLE_PATHS = ['animal', 'fazenda'];

export default function BreadcrumbArea() {
    const pathname = usePathname();
    const allPaths = pathname.split("/").filter(Boolean); // ex: ['auth', 'animal', 'cadastrar']

    // 2. Filtra segmentos que não queremos exibir, como 'auth'
    const pathsToRender = allPaths.filter(path => path.toLowerCase() !== 'auth');
    // pathsToRender agora é: ['animal', 'cadastrar']

    // 3. Caso especial: Se estivermos no dashboard ou na raiz 'auth',
    // mostramos apenas "Início" como a página atual.
    if (pathname === '/auth/dashboard' || pathname === '/auth') {
        return (
            <Breadcrumb>
                <BreadcrumbList className={"text-primary"}>
                    <BreadcrumbItem aria-current="page">
                        <BreadcrumbPage>Início</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    // Se não sobrar caminhos (ex: estava em /auth, que foi filtrado)
    if (pathsToRender.length === 0) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList className={"text-primary"}>
                <BreadcrumbItem>
                    {/* Link estático para "Início" */}
                    <BreadcrumbLink href="/auth/dashboard">Início</BreadcrumbLink>
                </BreadcrumbItem>

                {/* Renderiza os caminhos filtrados */}
                {pathsToRender.map((path, index) => {
                    // 4. Constrói o href corretamente, mantendo o prefixo /auth original
                    const href = "/auth/" + pathsToRender.slice(0, index + 1).join("/");
                    const isLast = index === pathsToRender.length - 1;
                    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

                    const isNonClickable = NON_CLICKABLE_PATHS.includes(path.toLowerCase());

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem aria-current={isLast ? "page" : undefined}>
                                {isLast ? (
                                    <BreadcrumbPage>{name}</BreadcrumbPage>
                                ) : isNonClickable ? (
                                    // Renderiza como texto simples (não-clicável)
                                    // Usamos um span com o estilo de fonte dos links
                                    <span className="font-medium">{name}</span>
                                ) : (
                                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}