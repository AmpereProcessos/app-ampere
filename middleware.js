import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.SECRET_NEXT_AUTH,
    raw: true,
  });
  if (!token) {
    request.nextUrl.searchParams.set(
      "msg",
      `Autenticação necessária para essa rota.`
    );
    request.nextUrl.searchParams.set("statusCode", 401);
    request.nextUrl.pathname = "/api/error";

    return NextResponse.redirect(request.nextUrl);
  }
  return NextResponse.next();
}
export const config = {
  matcher: "/api/projects/:path*",
};
