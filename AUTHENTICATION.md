# Authentication System

This MyAnimeList application includes a comprehensive authentication system built with SvelteKit, featuring secure user registration, login, and session management.

## Features

- **User Registration**: Secure account creation with validation
- **User Login**: Email/password authentication
- **Session Management**: JWT tokens stored in HTTP-only cookies
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Password Security**: Bcrypt hashing for password storage
- **Form Validation**: Client and server-side validation
- **Responsive UI**: Modern design with Tailwind CSS

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user info

### Protected Endpoints

- `GET /anime` - Anime list (requires authentication)
- `GET /anime/[id]` - Anime details (requires authentication)

## Database Schema

The authentication system uses the following database schema:

```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX username_idx ON user(username);
CREATE INDEX email_idx ON user(email);
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure session management with 7-day expiration
3. **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
4. **Input Validation**: Comprehensive server-side validation
5. **CSRF Protection**: SameSite cookie attributes
6. **Secure Headers**: Proper security headers in production

## Usage

### Registration

Users can register by visiting `/register` and providing:
- Username (minimum 3 characters)
- Email (valid format)
- Password (minimum 6 characters)
- Password confirmation

### Login

Users can login by visiting `/login` and providing:
- Email address
- Password

### Protected Routes

Routes that require authentication will automatically redirect unauthenticated users to the login page.

### Logout

Users can logout by clicking the logout button in the navigation bar, which will:
1. Clear the authentication cookie
2. Redirect to the home page

## Environment Variables

Set the following environment variable in production:

```env
JWT_SECRET=your-secure-secret-key-here
```

## Development

To run the application in development mode:

```bash
npm run dev
```

To push database schema changes:

```bash
npm run db:push
```

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── LoginForm.svelte
│   │   ├── RegisterForm.svelte
│   │   └── Navigation.svelte
│   ├── server/
│   │   ├── auth.ts          # Authentication utilities
│   │   └── protect.ts       # Route protection utilities
│   └── types/
│       └── auth.ts          # TypeScript interfaces
├── routes/
│   ├── api/auth/
│   │   ├── login/+server.ts
│   │   ├── register/+server.ts
│   │   ├── logout/+server.ts
│   │   └── user/+server.ts
│   ├── login/+page.svelte
│   ├── register/+page.svelte
│   └── +layout.server.ts
└── hooks.server.ts          # Authentication hooks
```

## Customization

### Adding New Protected Routes

To protect a new route, add authentication check in the page's server load function:

```typescript
// In +page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Your protected logic here
};
```

### Customizing Validation

Modify validation rules in the register and login API endpoints in `src/routes/api/auth/`.

### Styling

The authentication forms use Tailwind CSS classes. Customize the styling by modifying the class names in the component files.
