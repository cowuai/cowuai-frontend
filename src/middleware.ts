import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken");

    if (!refreshToken) {
        // Redireciona para o login, exceto se já estiver lá.
        if (req.nextUrl.pathname !== "/login") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|cadastro|api/public|_next|favicon\\.ico|images).+)"],
};
