import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userAnimeList } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entryId = parseInt(params.id);
    if (isNaN(entryId)) {
      return json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    // Delete the entry, ensuring it belongs to the current user
    const deletedEntry = await db
      .delete(userAnimeList)
      .where(and(
        eq(userAnimeList.id, entryId),
        eq(userAnimeList.userId, locals.user.id)
      ))
      .returning();

    if (deletedEntry.length === 0) {
      return json({ error: 'Entry not found or unauthorized' }, { status: 404 });
    }

    return json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Failed to delete watchlist entry:', error);
    return json({ error: 'Failed to delete watchlist entry' }, { status: 500 });
  }
};
