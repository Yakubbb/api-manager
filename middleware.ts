import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


const canBeWithoutCookie = [
    '/',
    '/login',
    '/register'
]

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const cookie = (await cookies()).get('session')?.value
    console.log(cookie)
    const isNotProtected = canBeWithoutCookie.includes(req.nextUrl.pathname)


    if (isNotProtected) {
        if (cookie) {
            return NextResponse.redirect(new URL('/main/playground', req.url))
        }
        return
    }
    else {
        if (!cookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}