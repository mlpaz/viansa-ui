import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserLoginResponse } from "./types";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieMng = cookies();
  const path = req.nextUrl.pathname;
  const session: UserLoginResponse = JSON.parse(
    req.cookies.get("session")?.value || "{}"
  );
  if (emptyObj(session) && path !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!emptyObj(session) && path === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

function emptyObj(o: any) {
  return Object.keys(o).length === 0;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/static|favicon.ico).*)"],
};
