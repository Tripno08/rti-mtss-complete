import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Desativar o middleware temporariamente para depuração
export function middleware(request: NextRequest) {
  // Permitir todas as requisições sem verificação
  return NextResponse.next();
}

// Configurar em quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 