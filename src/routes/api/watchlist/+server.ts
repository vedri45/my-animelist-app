import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userAnimeList } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const watchlist = await db
      .select()
      .from(userAnimeList)
      .where(eq(userAnimeList.userId, locals.user.id))
      .orderBy(userAnimeList.updatedAt);

    return json({ watchlist });
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { malId, title, imageUrl, status, score, progress, totalEpisodes, notes } = body;

    if (!malId || !title) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if anime already exists in user's list
    const existingEntry = await db
      .select()
      .from(userAnimeList)
      .where(and(
        eq(userAnimeList.userId, locals.user.id),
        eq(userAnimeList.malId, malId)
      ))
      .limit(1);

    if (existingEntry.length > 0) {
      // Update existing entry
      const updatedEntry = await db
        .update(userAnimeList)
        .set({
          status: status || existingEntry[0].status,
          score: score !== undefined ? score : existingEntry[0].score,
          progress: progress !== undefined ? progress : existingEntry[0].progress,
          totalEpisodes: totalEpisodes !== undefined ? totalEpisodes : existingEntry[0].totalEpisodes,
          notes: notes !== undefined ? notes : existingEntry[0].notes,
          updatedAt: new Date()
        })
        .where(eq(userAnimeList.id, existingEntry[0].id))
        .returning();

      return json({ entry: updatedEntry[0], action: 'updated' });
    } else {
      // Create new entry
      const newEntry = await db
        .insert(userAnimeList)
        .values({
          userId: locals.user.id,
          malId,
          title,
          imageUrl,
          status: status || 'plan_to_watch',
          score,
          progress: progress || 0,
          totalEpisodes,
          notes
        })
        .returning();

      return json({ entry: newEntry[0], action: 'created' });
    }
  } catch (error) {
    console.error('Failed to manage watchlist entry:', error);
    return json({ error: 'Failed to manage watchlist entry' }, { status: 500 });
  }
};
