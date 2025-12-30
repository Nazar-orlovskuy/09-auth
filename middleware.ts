import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AxiosResponse } from 'axios';
import { checkSession } from './lib/api/serverApi';
import type { User } from './types/user';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isPrivate = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute = pathname === '/sign-in' || pathname === '/sign-up';

  if (isPrivate && !accessToken) {
    if (refreshToken) {
      try {
        const cookieHeader = req.headers.get('cookie') ?? `refreshToken=${refreshToken}`;
        const res: AxiosResponse<User | null> = await checkSession(cookieHeader);
        const user: User | null = res.data; 

        if (user) {
          const response = NextResponse.next();



          return response;
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }

    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
