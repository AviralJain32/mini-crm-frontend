import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const { pathname } = req.nextUrl;

  // If token exists and user is on login or root, redirect to dashboard
  if (token && (pathname === '/' || pathname === '/login')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If token is missing and user tries to access protected dashboard routes
  if (!token && pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // allow request
}

export const config = {
  matcher: ["/login","/","/dashboard/:path*"]
}