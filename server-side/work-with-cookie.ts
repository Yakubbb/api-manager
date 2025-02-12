'use server'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AES } from 'crypto-ts';

export async function deleteCookie() {

    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}

export async function createKeysCookie(keys: { apiId: string, key: string }[]) {
    const cookieStore = await cookies()
    keys.forEach((item) => {

        const encryptedKey = AES.encrypt(item.key, 'rkfe').toString();

        cookieStore.set(
            {
                name: item.apiId,
                value: encryptedKey,
                httpOnly: true,
                path: '/',
            },
        )
    })
}

export async function getKeyFromCookie(keyName: string) {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('keyName')
    if (cookie) {
        return AES.decrypt(cookie?.value, 'rkfe')
    }
    else {
        return undefined
    }

}
