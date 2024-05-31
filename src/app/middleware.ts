import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/api/proxy")) {
    const allowedPaths = ["/api/v1/payload"];

    const requestedPath = url.pathname.replace("/api/proxy", "");
    if (allowedPaths.some((path) => requestedPath.startsWith(path))) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
