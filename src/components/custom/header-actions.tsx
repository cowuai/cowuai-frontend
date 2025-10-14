'use client';

import {usePathname} from "next/navigation";
import {SwitchThemeBox} from "@/components/custom/switch-theme-box";
import LogoutButton from "@/components/custom/logout-button";
import Image from "next/image";

export function HeaderActions() {
    return (
        <div className="w-auto flex items-center gap-6 justify-end p-4">
            <SwitchThemeBox/>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sidebar-ring">
                <Image
                    src="/images/user-photo.png"
                    alt="Foto do usuário"
                    width={40}
                    height={40}
                    className="object-cover"
                />
            </div>
            <LogoutButton/>
        </div>
    );
}
