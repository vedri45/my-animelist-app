import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export function requireAuth(): (handler: RequestHandler) => RequestHandler {
  return (handler: RequestHandler): RequestHandler => {
    return async (event) => {
      if (!event.locals.user) {
        throw redirect(302, '/login');
      }
      return handler(event);
    };
  };
}
