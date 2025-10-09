"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import {PiCow, PiUsersThree, PiKeyReturn, PiFarm, PiUser} from "react-icons/pi";
import {usePathname} from "next/navigation";
import {LuLayoutDashboard} from "react-icons/lu";
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronRight, ChevronUp} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useLogout} from "@/hooks/use-logout";
import {Button} from "@/components/ui/button";

type MenuItem = {
    title: string;
    url: string;
    icon: React.ComponentType<any>;
    subItems?: { title: string; url: string }[];
    isActive?: boolean;
}

// Menu items.
const items: MenuItem[] = [
    {
        title: "Dashboard",
        url: "/auth/dashboard",
        icon: LuLayoutDashboard,
    },
    {
        title: "Gestão de Animais",
        url: "#",
        icon: PiCow,
        subItems: [
            {title: "Cadastrar Animal", url: "/auth/animal/cadastrar"},
            {title: "Listar Animais", url: "/auth/animal/listar"},
        ]
    },
    {
        title: "Gestão de Fazendas",
        url: "#",
        icon: PiFarm,
        subItems: [
            {title: "Cadastrar Fazenda", url: "/auth/fazenda/cadastrar"},
            {title: "Listar Fazendas", url: "/auth/fazenda/listar"},
        ]
    },
]

// Dropdown Footer items
const footerItems: MenuItem[] = [
    {
        title: "Perfil",
        url: "#",
        icon: PiUser,
    },
    {
        title: "Sair",
        url: "#",
        icon: PiKeyReturn,
    }
]

function isActive(url: string, subItems?: { url: string }[], currentPath?: string) {
    if (url !== "#" && currentPath === url) return true;
    if (subItems) {
        return subItems.some(sub => currentPath === sub.url);
    }
    return false;
}

export default function AppSidebar() {
    const currentPath = usePathname();
    const handleLogout = useLogout();

    return (
        <Sidebar collapsible={"icon"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className={"flex justify-center"}>
                        <Image
                            src={"/images/cowuai-logo.png"}
                            alt={""}
                            width={150}
                            height={50}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                item.subItems ? (
                                    <Collapsible key={item.title}
                                                 asChild
                                                 defaultOpen={isActive(item.url, item.subItems, currentPath)}
                                                 className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton size={"lg"} asChild>
                                                    <Link href={item.url}>
                                                        <span
                                                            className={isActive(item.url, item.subItems, currentPath) ? "bg-accent-red-triangulo text-white rounded p-1" : "p-1"}>
                                                            <item.icon className="w-5 h-5"/>
                                                        </span>
                                                        <span>{item.title}</span>
                                                        <ChevronRight
                                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub className={"ml-5"}>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuSubItem className={"ml-4"} key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.url}>
                                                                    {subItem.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton size={"lg"} asChild>
                                            <a href={item.url}>
                                                <span
                                                    className={isActive(item.url, item.subItems, currentPath) ? "bg-accent-red-triangulo text-white rounded p-1" : "p-1"}>
                                                    <item.icon className="w-5 h-5"/>
                                                </span>
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <PiUser/> Usuário <ChevronUp className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side={"top"}
                                className="w-[--radix-popper-anchor-width]"
                            >
                                {footerItems.map((item) => (
                                    <DropdownMenuItem key={item.title} asChild>
                                        {item.title === "Sair" ? (
                                            <Button onClick={handleLogout} className="w-full bg-transparent text-foreground justify-start">
                                                <item.icon />
                                                {item.title}
                                            </Button>
                                        ) : (
                                            <Link href={item.url} className="flex items-center gap-2 w-full ml-1">
                                                <item.icon />
                                                {item.title}
                                            </Link>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
