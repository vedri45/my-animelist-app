<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  
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
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Anime List</h1>
  
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
        href={`?page=${data.currentPage - 1}`} 
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        Previous
      </a>
    {/if}
    
    <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
      Page {data.currentPage}
    </span>
    
    <a 
      href={`?page=${data.currentPage + 1}`} 
      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
    >
      Next
    </a>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
