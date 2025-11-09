import { NextResponse, type NextRequest } from 'next/server';

const premiumOrigins = [
  'https://proofport-demo.netlify.app',
];

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const requestOrigin = request.headers.get('Origin');

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  response.headers.set('Content-Security-Policy', 'frame-ancestors *');

  
  let coep = 'unsafe-none';
  let coop = 'same-origin-allow-popups';

  if (requestOrigin && premiumOrigins.includes(requestOrigin)) {
    coep = 'require-corp';
    coop = 'same-origin';
  }
  
  response.headers.set('Cross-Origin-Embedder-Policy', coep);
  response.headers.set('Cross-Origin-Opener-Policy', coop);

  return response;
}

export const config = {
  matcher: '/portal/:path*',
};