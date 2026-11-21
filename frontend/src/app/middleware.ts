import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET || '';
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('finanzas_session')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname.startsWith('/login');

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, getSecretKey());
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    // Si el token expiró o fue manipulado, borramos la cookie y mandamos a login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('finanzas_session');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};