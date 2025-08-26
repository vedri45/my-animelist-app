import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAnimeById } from '$lib/api/jikan';

export const load: PageServerLoad = async ({ params, locals }) => {
  // Require authentication
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  try {
    const animeId = params.id;
    if (!animeId) {
      throw error(400, 'Anime ID is required');
    }

    const anime = await getAnimeById(animeId);
    
    if (!anime) {
      throw error(404, 'Anime not found');
    }
    
    return {
      anime
    };
  } catch (err) {
    console.error(`Failed to load anime details:`, err);
    throw error(500, 'Failed to load anime details');
  }
};
