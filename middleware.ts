import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const cookie = (await cookies()).get('session')?.value
    console.log(cookie)
    console.log('aboba')
    //return NextResponse.redirect(new URL('/main/playground', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*',
}