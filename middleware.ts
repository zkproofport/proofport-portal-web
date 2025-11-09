import { NextResponse, type NextRequest } from 'next/server';

const premiumOrigins = [
  'https://proofport-demo.netlify.app',
];

export function middleware(request: NextRequest) {
  const requestOrigin = request.headers.get('Origin');
  
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  response.headers.set('Content-Security-Policy', 'frame-ancestors *');


  if (request.nextUrl.pathname.startsWith('/portal-premium')) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  } else if (request.nextUrl.pathname.startsWith('/portal')) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
  
  return response;
}

export const config = {
  matcher: ['/portal', '/portal-premium'],
};