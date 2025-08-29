import type { Anime, AnimeListResponse, AnimeDetails } from '$lib/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export async function getTopAnime(page: number = 1): Promise<Anime[]> {
  const response = await fetch(`${BASE_URL}/top/anime?page=${page}`);
  const data: AnimeListResponse = await response.json();
  return data.data;
}

export async function searchAnime(query: string, page: number = 1): Promise<Anime[]> {
  const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}`);
  const data: AnimeListResponse = await response.json();
  return data.data;
}

export async function getAnimeById(id: string): Promise<AnimeDetails> {
  const response = await fetch(`${BASE_URL}/anime/${id}/full`);
  const { data } = await response.json();
  return data;
}

// Fetch anime genres (for filters)
export async function getGenres() {
  const response = await fetch(`${BASE_URL}/genres/anime`);
  const { data } = await response.json();
  return data;
}

// Generic anime listing with optional search and genre filters
export async function listAnime(params: { q?: string; page?: number; genres?: Array<string | number> } = {}): Promise<Anime[]> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  searchParams.set('page', String(params.page ?? 1));
  if (params.genres && params.genres.length) {
    searchParams.set('genres', params.genres.join(','));
  }

  const response = await fetch(`${BASE_URL}/anime?${searchParams.toString()}`);
  const data: AnimeListResponse = await response.json();
  return data.data;
}
