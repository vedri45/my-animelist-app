import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserByEmail, getUserByUsername, createUser, generateToken } from '$lib/server/auth';
import type { RegisterRequest, AuthResponse, AuthError } from '$lib/types/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body: RegisterRequest = await request.json();
    const { username, email, password, confirmPassword } = body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      const error: AuthError = { message: 'All fields are required' };
      return json(error, { status: 400 });
    }

    if (password !== confirmPassword) {
      const error: AuthError = { message: 'Passwords do not match', field: 'confirmPassword' };
      return json(error, { status: 400 });
    }

    if (password.length < 6) {
      const error: AuthError = { message: 'Password must be at least 6 characters long', field: 'password' };
      return json(error, { status: 400 });
    }

    if (username.length < 3) {
      const error: AuthError = { message: 'Username must be at least 3 characters long', field: 'username' };
      return json(error, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error: AuthError = { message: 'Please enter a valid email address', field: 'email' };
      return json(error, { status: 400 });
    }

    // Check if user already exists
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      const error: AuthError = { message: 'Email already registered', field: 'email' };
      return json(error, { status: 409 });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      const error: AuthError = { message: 'Username already taken', field: 'username' };
      return json(error, { status: 409 });
    }

    // Create user
    const user = await createUser(username, email, password);

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
    console.error('Register error:', error);
    const authError: AuthError = { message: 'Internal server error' };
    return json(authError, { status: 500 });
  }
};
