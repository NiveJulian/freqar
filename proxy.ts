import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // Next.js decodes standard URL parameters, but let's make sure we also catch
  // any raw percent-encoded characters by decoding it explicitly.
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch (e) {
    // Ignore decoding errors and fallback to original pathname
  }

  // Check if the path contains "<", ">" or their URL-encoded forms
  if (
    decodedPath.includes('<') ||
    decodedPath.includes('>') ||
    pathname.includes('%3C') ||
    pathname.includes('%3E') ||
    pathname.includes('%3c') ||
    pathname.includes('%3e')
  ) {
    // Clean up the path by removing all occurrences of "<", ">" and their url-encoded equivalents.
    // E.g., "/</links/5" or "/%3C/links/5" -> "/links/5"
    let cleanPath = decodedPath
      .replace(/<|>|%3C|%3E/gi, '')
      .replace(/^\/+/, '/'); // Ensure it starts with a single slash

    if (!cleanPath) {
      cleanPath = '/';
    }

    url.pathname = cleanPath;

    console.log(`[Proxy Redirect] Malformed path ${pathname} redirected to ${cleanPath}`);

    // Use a 301 Permanent Redirect so search engines and browsers cache the corrected URL.
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run proxy on all paths except static files, images, and favicons
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
