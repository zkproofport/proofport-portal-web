import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  res.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://proofport-demo.netlify.app"
  );

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  const p = request.nextUrl.pathname;

  if (p.startsWith('/portal-premium')) {
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  } else if (p.startsWith('/portal')) {
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }

  return res;
}

export const config = {
  matcher: ['/portal', '/portal/:path*', '/portal-premium', '/portal-premium/:path*'],
};
