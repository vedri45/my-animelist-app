import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserByEmail, comparePassword, generateToken } from '$lib/server/auth';
import type { LoginRequest, AuthResponse, AuthError } from '$lib/types/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      const error: AuthError = { message: 'Email and password are required' };
      return json(error, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      const error: AuthError = { message: 'Invalid credentials' };
      return json(error, { status: 401 });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      const error: AuthError = { message: 'Invalid credentials' };
      return json(error, { status: 401 });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email
    });

    // Set secure HTTP-only cookie
    cookies.set('auth-token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };

    return json(response);
  } catch (error) {
    console.error('Login error:', error);
    const authError: AuthError = { message: 'Internal server error' };
    return json(authError, { status: 500 });
  }
};
