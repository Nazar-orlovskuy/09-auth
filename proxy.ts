import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";

import { checkSession } from "./lib/api/serverApi";
import type { User } from "./types/user";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isPublicAuthRoute =
    pathname === "/sign-in" || pathname === "/sign-up";

  if (isPrivateRoute && !accessToken) {
    if (!refreshToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    try {
      const cookieHeader = `refreshToken=${refreshToken}`;

      const res: AxiosResponse<User | null> =
        await checkSession(cookieHeader);

      if (!res.data) {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      }

      const response = NextResponse.next();

      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        setCookie.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });
      }

      return response;
    } catch (error) {
      console.error("Proxy session check failed:", error);

      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  if (isPublicAuthRoute) {
    if (accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
