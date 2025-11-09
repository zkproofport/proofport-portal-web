import { NextResponse, type NextRequest } from 'next/server';

const premiumOrigins = [
  'https://proofport-demo.netlify.app',
];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/portal')) {
    
    const requestOrigin = request.headers.get('Origin');

    const headers = new Headers();
    
    headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');

    if (requestOrigin && premiumOrigins.includes(requestOrigin)) {
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    }

    const response = NextResponse.next();
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/portal/:path*',
};