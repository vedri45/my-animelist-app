import { verifyToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get the auth token from cookies
  const token = event.cookies.get('auth-token');
  
  if (token) {
    try {
      // Verify the token and get user data
      const user = verifyToken(token);
      if (user) {
        // Attach user data to locals so it's available in all routes
        event.locals.user = user;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear invalid token
      event.cookies.delete('auth-token', { path: '/' });
    }
  }

  const response = await resolve(event);
  return response;
};
