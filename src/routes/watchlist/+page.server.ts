import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userAnimeList } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  // Require authentication
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  try {
    const watchlist = await db
      .select()
      .from(userAnimeList)
      .where(eq(userAnimeList.userId, locals.user.id))
      .orderBy(userAnimeList.updatedAt);

    // Group anime by status
    const groupedWatchlist = {
      watching: watchlist.filter(anime => anime.status === 'watching'),
      completed: watchlist.filter(anime => anime.status === 'completed'),
      on_hold: watchlist.filter(anime => anime.status === 'on_hold'),
      dropped: watchlist.filter(anime => anime.status === 'dropped'),
      plan_to_watch: watchlist.filter(anime => anime.status === 'plan_to_watch')
    };

    return {
      watchlist,
      groupedWatchlist,
      user: locals.user
    };
  } catch (err) {
    console.error('Failed to load watchlist:', err);
    throw error(500, 'Failed to load watchlist');
  }
};
