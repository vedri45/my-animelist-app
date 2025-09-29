import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  // Clear the auth token cookie
  cookies.delete('auth-token', { path: '/' });
  
  return json({ message: 'Logged out successfully' });
};
