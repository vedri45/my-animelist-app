import type { Anime, AnimeListResponse, AnimeDetails } from '$lib/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export async function getTopAnime(page: number = 1): Promise<Anime[]> {
  const response = await fetch(`${BASE_URL}/top/anime?page=${page}`);
  const data: AnimeListResponse = await response.json();
  return data.data;
}

export async function getAnimeById(id: string): Promise<AnimeDetails> {
  const response = await fetch(`${BASE_URL}/anime/${id}/full`);
  const { data } = await response.json();
  return data;
}
