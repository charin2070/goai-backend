// This file is intentionally blank.
// It can be used for middleware logic in the future.
export function middleware() {}

// Don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
