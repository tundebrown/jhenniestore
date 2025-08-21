// middleware.ts
import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { NextResponse } from 'next/server'

const PUBLIC_PREFIXES = [
  '/',          // homepage
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/product',
  '/page',
]

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  const isPublic =
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isPublic) return NextResponse.next()

  if (!req.auth) {
    const url = new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(pathname) || '/'}`,
      req.nextUrl.origin
    )
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  // run on all non-static, non-API paths
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
