import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;

  const isPrivate = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute = pathname === '/sign-in' || pathname === '/sign-up';

  if (isPrivate && !accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};