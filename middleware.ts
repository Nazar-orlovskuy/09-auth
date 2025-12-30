import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isPrivate =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute =
    pathname === '/sign-in' || pathname === '/sign-up';

  if (isPrivate && !accessToken) {
    if (refreshToken) {
      try {
        const cookieHeader = req.headers.get('cookie') ?? `refreshToken=${refreshToken}`;
        const res = await checkSession(cookieHeader);

        if (res?.data) {
          const response = NextResponse.next();

          const setCookie = (res.headers as Record<string, string | string[] | undefined>)['set-cookie'];
          if (setCookie) {
            const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
            for (const c of cookies) {
              const parts = c.split(';').map((p) => p.trim());
              const [nameValue, ...attrs] = parts;
              const eqIndex = nameValue.indexOf('=');
              if (eqIndex === -1) continue;
              const name = nameValue.slice(0, eqIndex);
              const value = nameValue.slice(eqIndex + 1);

              const options: Record<string, unknown> = {};
              for (const attr of attrs) {
                const lower = attr.toLowerCase();
                if (lower.startsWith('expires=')) {
                  const v = attr.split('=')[1];
                  const d = new Date(v);
                  if (!isNaN(d.getTime())) options.expires = d;
                } else if (lower.startsWith('max-age=')) {
                  options.maxAge = Number(attr.split('=')[1]);
                } else if (lower.startsWith('path=')) {
                  options.path = attr.split('=')[1];
                } else if (lower === 'httponly') {
                  options.httpOnly = true;
                } else if (lower === 'secure') {
                  options.secure = true;
                } else if (lower.startsWith('samesite=')) {
                  options.sameSite = attr.split('=')[1] as 'lax' | 'strict' | 'none';
                }
              }

              try {
                response.cookies.set(name, value, options);
              } catch {
              }
            }
          }

          return response;
        }
      } catch {

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
  matcher: ['/', '/api/:path*', '/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
