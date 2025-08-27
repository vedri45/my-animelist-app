import { defineConfig } from 'drizzle-kit';

if (!process.env.TURSO_CONNECTION_URL) throw new Error('TURSO_CONNECTION_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: process.env.TURSO_CONNECTION_URL },
	verbose: true,
	strict: true
});
