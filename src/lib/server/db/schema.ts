import { sqliteTable, integer, text, index, real } from 'drizzle-orm/sqlite-core';

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

export const userAnimeList = sqliteTable('user_anime_list', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  malId: integer('mal_id').notNull(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  status: text('status', { enum: ["watching", "completed", "on_hold", "dropped", "plan_to_watch"] }).notNull().default('plan_to_watch'),
  score: real('score'),
  progress: integer('progress').default(0),
  totalEpisodes: integer('total_episodes'),
  rewatches: integer('rewatches').default(0),
  startDate: text('start_date'),
  finishDate: text('finish_date'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
}, (table) => ({
  userIdIndex: index('user_id_idx').on(table.userId),
  malIdIndex: index('mal_id_idx').on(table.malId),
  statusIndex: index('status_idx').on(table.status)
}));