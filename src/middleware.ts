// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const nextIntlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
  // Used when no locale matches
  defaultLocale: 'en',
});

export const config = {
  matcher: [
    // Match all paths, but exclude specific patterns
    '/((?!api|_next/static|favicon.ico|static|public))',
    '/(ar|en)/:path*',  // Match paths starting with 'ar/' or 'en/'
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  // Bypass middleware for static files and assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/public') ||
    url.pathname.startsWith('/static') ||
    url.pathname.startsWith('/messages') ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/.test(url.pathname)
  ) {
    return NextResponse.next();
  }



  const response = nextIntlMiddleware(req);
  return response;
}