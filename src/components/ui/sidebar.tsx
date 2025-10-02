"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiCow, PiUsersThree, PiKeyReturn } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaChevronRight } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col justify-between shadow-lg transition-all duration-300 bg-sidebar text-sidebar-foreground ${
        sidebarOpen ? "w-64 p-6" : "w-20 p-2"
      }`}
    >
      <div>
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-10">
          <Image
            src="/images/cowuai-logo.png"
            alt="CowUai Logo"
            width={sidebarOpen ? 100 : 40}
            height={sidebarOpen ? 100 : 40}
          />
          <PiKeyReturn
            size={30}
            className="text-red-600 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        {/* Navegação */}
        <nav className="space-y-2">
          <Link
            href="/auth/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-500 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LuLayoutDashboard size={20} className="text-red-600" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <PiCow size={20} className="text-red-600" />
              {sidebarOpen && <span>Gerenciar Animais</span>}
              <FaChevronRight className="transition-transform duration-300 group-open:rotate-90 text-red-600" />
            </summary>
            {sidebarOpen && (
              <ul className="mt-2 space-y-1 text-md bg-sidebar text-sidebar-foreground rounded-md p-2">
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="/auth/animal/cadastrar">Cadastrar Animal</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Atualizar Animal</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Excluir Animal</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Visualizar Animal</Link>
                </li>
              </ul>
            )}
          </details>

          <details className="group mt-2">
            <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <PiUsersThree size={20} className="text-red-600" />
              {sidebarOpen && <span>Gerenciar Fazendas</span>}
              <FaChevronRight className="transition-transform duration-300 group-open:rotate-90 text-red-600" />
            </summary>
            {sidebarOpen && (
              <ul className="mt-2 space-y-1 text-md bg-sidebar text-sidebar-foreground rounded-md p-2">
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="/auth/fazenda/cadastrar">Cadastrar Fazenda</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="/auth/fazenda/listar">Listar Fazendas</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Atualizar Fazenda</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Excluir Fazenda</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href="#">Visualizar Fazenda</Link>
                </li>
              </ul>
            )}
          </details>
        </nav>
      </div>
    </aside>
  );
}
