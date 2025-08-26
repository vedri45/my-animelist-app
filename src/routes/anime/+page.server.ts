import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTopAnime } from '$lib/api/jikan';

export const load: PageServerLoad = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page')) || 1;
    const animeList = await getTopAnime(page);
    
    return {
      animeList,
      currentPage: page,
    };
  } catch (err) {
    console.error('Failed to load anime list:', err);
    throw error(500, 'Failed to load anime list');
  }
};
