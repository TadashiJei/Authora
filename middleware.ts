import { authMiddleware } from '@civic/auth-web3/nextjs/middleware';

export default authMiddleware();

export const config = {
  // Adjust the matcher to protect specific routes like /dashboard
  // For now, this is a general matcher excluding static files and API routes
  matcher: [
    '/dashboard/:path*', // Protect all routes under /dashboard
    '/payment/:path*',   // Protect all routes under /payment (assuming it's for logged-in users)
    // Add other specific paths that need protection here, for example:
    // '/settings/:path*',
    // '/profile/:path*'
  ],
};
