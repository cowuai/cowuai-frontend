import React from "react";
import {
    Breadcrumb, BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";

export default function BreadcrumbArea() {
    // pega a rota atual e constrói os itens do breadcrumb dinamicamente
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean); // remove strings vazias

    // não renderiza o breadcrumb na página inicial
    if (paths.length === 0) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList className={"text-primary"}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/auth/dashboard">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator/>

                {paths.map((path, index) => {
                    const href = "/" + paths.slice(0, index + 1).join("/");
                    const isLast = index === paths.length - 1;
                    const isAuth = path.toLowerCase() === "auth";
                    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem aria-current={isLast ? "page" : undefined}>
                                {isAuth ? (
                                    <BreadcrumbEllipsis/>
                                ) : isLast ? (
                                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                                ) : (
                                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && <BreadcrumbSeparator key={`${href}-separator`}/>}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}