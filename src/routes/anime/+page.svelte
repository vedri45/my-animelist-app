<script lang="ts">
  import type { PageData } from './$types';
  import { page, navigating } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  export let data: PageData;
  
  const statusBadgeClasses = {
    'Currently Airing': 'bg-blue-100 text-blue-800',
    'Finished Airing': 'bg-green-100 text-green-800',
    'Not yet aired': 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  };
  
  function getStatusClass(status: string) {
    return statusBadgeClasses[status as keyof typeof statusBadgeClasses] || statusBadgeClasses.default;
  }
  
  function formatDate(dateString: string) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
  
  async function quickAddAnime(anime: any) {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          malId: anime.mal_id,
          title: anime.title,
          imageUrl: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          status: 'plan_to_watch',
          progress: 0
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.action === 'created') {
          alert('Anime added to your watch list!');
        } else if (result.action === 'updated') {
          alert('Anime already in your watch list!');
        }
      } else {
        alert('Failed to add anime to watch list');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Error adding anime to watch list');
    }
  }

  // Build pagination links preserving current filters
  function hrefWithPage(p: number) {
    const sp = new URLSearchParams($page.url.searchParams);
    sp.set('page', String(p));
    return `?${sp.toString()}`;
  }

  // AJAX-like filters
  let filterForm: HTMLFormElement | null = null;
  let searchTimer: any;

  function submitFilters(form: HTMLFormElement | null) {
    if (!form) return;
    const fd = new FormData(form);
    const sp = new URLSearchParams();
    const q = (fd.get('q') as string) || '';
    if (q.trim()) sp.set('q', q.trim());
    const genres = fd.getAll('genre').map(String);
    for (const g of genres) sp.append('genre', g);
    // when changing filters, reset page to 1
    sp.set('page', '1');
    goto(`?${sp.toString()}`, { keepFocus: true, noScroll: true });
  }

  let showGenres = $page.url.searchParams.has('genre');
  
  function onSearchInput(e: Event) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => submitFilters(filterForm), 400);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Anime List</h1>
  {#if $navigating}
    <div class="mb-3 text-sm text-gray-500">Loading…</div>
  {/if}
  
  <!-- Filters -->
  <form method="get" class="mb-6 bg-white rounded-lg shadow p-4 w-full" bind:this={filterForm} on:submit|preventDefault={() => submitFilters(filterForm)}>
    <div class="flex flex-col gap-4 w-full">
      <div class="flex gap-3 w-full">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="q"
            placeholder="Search anime..."
            value={data.query || ''}
            on:input={onSearchInput}
            class="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button 
              type="button"
              class="p-1 text-gray-400 hover:text-indigo-600 rounded-md transition-colors"
              class:bg-indigo-50={showGenres}
              class:text-indigo-600={showGenres}
              on:click|stopPropagation={() => showGenres = !showGenres}
              aria-label="Toggle genre filters"
              title="Toggle genre filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
        <!-- <button type="submit" class="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </button> -->
        <a href="/anime" class="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors" title="Reset filters">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>

      {#if data.genres?.length && showGenres}
        <div transition:fade>
          <div class="text-sm text-gray-600 mb-2">Filter by genres ({data.selectedGenres?.length || 0} selected)</div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-auto pr-1">
            {#each data.genres as g}
              <label class="flex items-center gap-2 text-sm bg-gray-50 rounded px-2 py-1">
                <input
                  type="checkbox"
                  name="genre"
                  value={g.mal_id}
                  checked={data.selectedGenres?.includes(String(g.mal_id))}
                  on:change={() => submitFilters(filterForm)}
                />
                <span>{g.name}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </form>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each data.animeList as anime}
      <a 
        href="/anime/{anime.mal_id}" 
        class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="relative">
          <img 
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
            alt={anime.title}
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          <div class="absolute top-2 right-2 flex flex-col gap-2">
            <button
              on:click={(e) => {
                e.preventDefault();
                quickAddAnime(anime);
              }}
              class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center self-end gap-1 transition-colors"
              title="Add to Watch List"
              aria-label="Add to Watch List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{anime.title}</h3>
          <div class="flex items-center text-sm text-gray-600 mb-2">
            <span>{anime.type}</span>
            <span class="mx-2">•</span>
            <span>{anime.episodes || '?'} eps</span>
            <span class="mx-2">•</span>
            <span>{anime.year || '?'}</span>
          </div>
          <div class="flex flex-wrap gap-1 mt-2">
            {#if anime.score}
              <span class="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center self-end">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {anime.score.toFixed(1)}
              </span>
            {/if}
            <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(anime.status)}`}>
              {anime.status}
            </span>
          </div>
          <div class="flex flex-wrap gap-1 mt-2">
            {#each anime.genres.slice(0, 3) as genre}
              <span class="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                {genre.name}
              </span>
            {/each}
          </div>
        </div>
      </a>
    {/each}
  </div>
  
  <div class="mt-8 flex justify-center gap-4">
    {#if data.currentPage > 1}
      <a 
        href={hrefWithPage(data.currentPage - 1)} 
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        Previous
      </a>
    {/if}
    
    <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
      Page {data.currentPage}
    </span>
    
    <a 
      href={hrefWithPage(data.currentPage + 1)} 
      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
    >
      Next
    </a>
  </div>
</div>

<style>
  .line-clamp-2 {
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
