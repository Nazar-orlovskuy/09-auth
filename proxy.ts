import axios, { AxiosRequestConfig } from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});


export async function proxy(req: NextRequest, path: string) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isPrivate = path.startsWith('/profile') || path.startsWith('/notes');
  const isAuthRoute = path === '/sign-in' || path === '/sign-up';


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


  const headers: AxiosRequestConfig['headers'] = {};
  if (accessToken || refreshToken) {
    headers['Cookie'] = req.headers.get('cookie') ?? '';
  }

  return { headers };
}
