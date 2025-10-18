'use server';

import { cookies } from 'next/headers';

export async function setCookie(key: string, value: string, expires: Date | undefined = undefined) {
    (await cookies()).set(key, value, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        expires: expires || undefined,
    });

    console.log(`Cookie set: ${key}=${value}, expires=${expires}`);
}