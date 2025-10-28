'use client';

import {SwitchThemeBox} from "@/components/custom/SwitchThemeBox";
import LogoutButton from "@/components/custom/LogoutButton";
import {useAuth} from "@/app/providers/AuthProvider";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {useRouter} from "next/navigation";

export function HeaderActions() {
    const { usuario } = useAuth();
    const router = useRouter();
    const DEFAULT_AVATAR = "https://github.githubassets.com/assets/quickdraw-default--light-medium-5450fadcbe37.png";
    const avatarUrl = usuario?.urlImagem || DEFAULT_AVATAR;

    return (
        <div className="w-auto flex items-center gap-6 justify-end p-4">
            <SwitchThemeBox/>
                <Avatar className="h-12 w-12 border-4 border-white shadow-xl hover:scale-105 transition-transform" onClick={() => {
                    router.push('/auth/perfil');
                }}>
                    <AvatarImage src={avatarUrl} alt={usuario?.nome} />
                    <AvatarFallback className="bg-secondary text-primary text-sm">
                        {usuario?.nome.split(' ').filter(Boolean).map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
            <LogoutButton/>
        </div>
    );
}
