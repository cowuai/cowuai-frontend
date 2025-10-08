"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {PiCow, PiUsersThree, PiKeyReturn, PiFarm, PiUser} from "react-icons/pi";
import {LuLayoutDashboard} from "react-icons/lu";
import {FaChevronRight} from "react-icons/fa";
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronRight, ChevronUp, User2} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

// Menu items.
const items = [
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
const footerItems = [
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

export default function AppSidebar() {
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
                                                 defaultOpen={false}
                                                 className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </a>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <Link href={subItem.url}>
                                                            {subItem.title}
                                                        </Link>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                            </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon/>
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
                                        <a href={item.url} className={"flex items-center w-full"}>
                                            <item.icon className={"mr-2"}/>
                                            {item.title}
                                        </a>
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
