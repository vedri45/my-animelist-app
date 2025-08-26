import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
}, (table) => ({
  usernameIndex: index('username_idx').on(table.username),
  emailIndex: index('email_idx').on(table.email)
}));

export const anime = sqliteTable('anime', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  images: text('images', { mode: 'json' }).$type<{
    jpg?: { image_url?: string; small_image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; small_image_url?: string; large_image_url?: string };
  }>(),
  episodes: integer('episodes').default(0),
  status: text('status', { enum: ["watching", "completed", "on_hold", "dropped", "plan_to_watch"] }).notNull(),
  score: integer('score')
});