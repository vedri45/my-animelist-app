import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserById } from '$lib/server/auth';
import type { AuthError } from '$lib/types/auth';

export const GET: RequestHandler = async ({ cookies, locals }) => {
  try {
    const user = locals.user;
    
    if (!user) {
      const error: AuthError = { message: 'Not authenticated' };
      return json(error, { status: 401 });
    }

    const userData = await getUserById(user.id);
    if (!userData) {
      const error: AuthError = { message: 'User not found' };
      return json(error, { status: 404 });
    }

    return json({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    const authError: AuthError = { message: 'Internal server error' };
    return json(authError, { status: 500 });
  }
};
