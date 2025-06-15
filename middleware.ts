import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


const canBeWithoutCookie = [
    '/',
    '/login',
    '/register',
]


export async function middleware(req: NextRequest) {
    const cookie = (await cookies()).get('session')?.value
    const isDropRoute = req.nextUrl.pathname.startsWith('/drop/');

    if (canBeWithoutCookie.includes(req.nextUrl.pathname) || isDropRoute) {

        if (cookie && !isDropRoute) {
            return NextResponse.redirect(new URL('/main/', req.url))
        }
        return
    }
    else {
        console.log(req.nextUrl.pathname)
        if (!cookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}