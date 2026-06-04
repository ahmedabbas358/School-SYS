import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/api/auth'];
const SESSION_COOKIE = 'school-erp-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // Redirect to login if accessing private route without session
  if (!isPublicRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing login page with existing session
  if (isPublicRoute && hasSession && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/public (public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images folder)
     */
    '/((?!api/public|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
