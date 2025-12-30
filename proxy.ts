import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AxiosResponse } from "axios";
import { checkSession } from "./lib/api/serverApi";
import type { User } from "./types/user";


export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isPublicAuthRoute =
    pathname === "/sign-in" || pathname === "/sign-up";


  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const cookieHeader =
          req.headers.get("cookie") ??
          `refreshToken=${refreshToken}`;

        const res: AxiosResponse<User | null> =
          await checkSession(cookieHeader);

        if (res.data) {

          return NextResponse.next();
        }
      } catch (error) {
        console.error("Proxy session check failed:", error);
      }
    }

    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isPublicAuthRoute && accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
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
