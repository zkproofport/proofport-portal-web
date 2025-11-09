import { NextResponse, type NextRequest } from 'next/server';

const premiumOrigins = [
  'https://proofport-demo.netlify.app',
  // 'https://another-premium-dapp.com',
];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/portal')) {
    
    const requestOrigin = request.headers.get('Origin');

    let coep = 'unsafe-none';
    let coop = 'same-origin-allow-popups';

    if (requestOrigin && premiumOrigins.includes(requestOrigin)) {
      coep = 'require-corp';
      coop = 'same-origin';
    }

    const response = NextResponse.next();
    response.headers.set('Cross-Origin-Embedder-Policy', coep);
    response.headers.set('Cross-Origin-Opener-Policy', coop);
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/portal/:path*',
};