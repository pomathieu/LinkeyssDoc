// middleware.ts
export { auth as middleware } from './src/app/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
