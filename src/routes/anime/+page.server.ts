import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTopAnime, listAnime, getGenres } from '$lib/api/jikan';

export const load: PageServerLoad = async ({ url, locals }) => {
  // Require authentication
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  try {
    const page = Number(url.searchParams.get('page')) || 1;
    const q = url.searchParams.get('q') || '';
    // Support both repeated ?genre=1&genre=2 and comma "genres=1,2"
    const repeatedGenres = url.searchParams.getAll('genre');
    const commaGenres = (url.searchParams.get('genres') || '')
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
    const selectedGenres = (repeatedGenres.length ? repeatedGenres : commaGenres).filter(Boolean);

    const [genres, animeList] = await Promise.all([
      getGenres(),
      q || selectedGenres.length
        ? listAnime({ q, page, genres: selectedGenres })
        : getTopAnime(page)
    ]);
    
    return {
      animeList,
      currentPage: page,
      genres,
      selectedGenres,
      query: q
    };
  } catch (err) {
    console.error('Failed to load anime list:', err);
    throw error(500, 'Failed to load anime list');
  }
};
