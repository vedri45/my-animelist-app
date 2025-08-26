<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  
  export let data: PageData;
  const { anime } = data;
  
  let activeTab = 'overview';
  let showTrailer = false;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  const formatDuration = (duration: string) => {
    if (!duration) return 'Unknown';
    return duration.replace(' per episode', '');
  };
  
  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      'Currently Airing': 'bg-blue-100 text-blue-800',
      'Finished Airing': 'bg-green-100 text-green-800',
      'Not yet aired': 'bg-yellow-100 text-yellow-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.default;
  };
</script>

<div class="bg-gray-50 min-h-screen">
  <!-- Back button -->
  <div class="container mx-auto px-4 py-4">
    <a 
      href="/anime" 
      class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Anime List
    </a>
  </div>
  
  <!-- Hero Section -->
  <div class="bg-white shadow">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Poster -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <div class="relative">
            <img 
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
              alt={anime.title}
              class="w-full rounded-lg shadow-lg"
            />
            {#if anime.trailer?.youtube_id}
              <button 
                on:click={() => showTrailer = true}
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Play trailer"
              >
                <div class="bg-red-600 text-white rounded-full p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            {/if}
          </div>
          
          <!-- Score -->
          {#if anime.score}
            <div class="mt-4 bg-gray-50 p-4 rounded-lg">
              <div class="text-4xl font-bold text-center">
                {anime.score}
                <span class="text-gray-500 text-lg">/10</span>
              </div>
              <div class="text-center text-gray-600">
                Scored by {anime.scored_by?.toLocaleString() || 'N/A'} users
              </div>
              <div class="mt-2 text-center text-sm text-gray-500">
                Ranked #{anime.rank}
              </div>
              <div class="mt-4 text-center">
                <span class={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(anime.status)}`}>
                  {anime.status}
                </span>
              </div>
            </div>
          {/if}
          
          <!-- Info -->
          <div class="mt-6 space-y-3 text-sm">
            <div>
              <div class="text-gray-500 font-medium">English:</div>
              <div>{anime.title_english || 'N/A'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Japanese:</div>
              <div>{anime.title_japanese || 'N/A'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Type:</div>
              <div>{anime.type || 'N/A'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Episodes:</div>
              <div>{anime.episodes || '?'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Status:</div>
              <div>{anime.status || 'N/A'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Aired:</div>
              <div>{formatDate(anime.aired?.from)} to {anime.aired?.to ? formatDate(anime.aired.to) : '?'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Premiered:</div>
              <div>{anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : 'N/A'}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Duration:</div>
              <div>{formatDuration(anime.duration)}</div>
            </div>
            <div>
              <div class="text-gray-500 font-medium">Rating:</div>
              <div>{anime.rating || 'N/A'}</div>
            </div>
          </div>
          
          <!-- Genres -->
          {#if anime.genres?.length > 0}
            <div class="mt-6">
              <div class="text-gray-500 font-medium mb-2">Genres:</div>
              <div class="flex flex-wrap gap-2">
                {#each anime.genres as genre}
                  <a 
                    href={`/anime?genres=${genre.mal_id}`}
                    class="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {genre.name}
                  </a>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Studios -->
          {#if anime.studios?.length > 0}
            <div class="mt-4">
              <div class="text-gray-500 font-medium mb-2">Studios:</div>
              <div class="flex flex-wrap gap-2">
                {#each anime.studios as studio}
                  <span class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {studio.name}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Main Content -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2">{anime.title}</h1>
          
          <!-- Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                class={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                on:click={() => activeTab = 'overview'}
              >
                Overview
              </button>
              <button
                class={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                on:click={() => activeTab = 'stats'}
              >
                Stats
              </button>
            </nav>
          </div>
          
          <!-- Tab Content -->
          <div class="prose max-w-none">
            {#if activeTab === 'overview'}
              <div>
                <h3 class="text-xl font-semibold mb-4">Synopsis</h3>
                <p class="whitespace-pre-line">{anime.synopsis || 'No synopsis available.'}</p>
                
                {#if anime.background}
                  <h3 class="text-xl font-semibold mt-8 mb-4">Background</h3>
                  <p class="whitespace-pre-line">{anime.background}</p>
                {/if}
              </div>
            {:else if activeTab === 'stats'}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-xl font-semibold mb-4">Details</h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Japanese</dt>
                      <dd class="w-2/3">{anime.title_japanese || 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Aired</dt>
                      <dd class="w-2/3">{formatDate(anime.aired?.from)} to {anime.aired?.to ? formatDate(anime.aired.to) : '?'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Premiered</dt>
                      <dd class="w-2/3">{anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Duration</dt>
                      <dd class="w-2/3">{formatDuration(anime.duration)}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Status</dt>
                      <dd class="w-2/3">{anime.status || 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Rating</dt>
                      <dd class="w-2/3">{anime.rating || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 class="text-xl font-semibold mb-4">Statistics</h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Score</dt>
                      <dd class="w-2/3">
                        <div class="flex items-center">
                          <span class="font-semibold mr-2">{anime.score || 'N/A'}</span>
                          <span class="text-sm text-gray-500">({anime.scored_by?.toLocaleString() || 0} users)</span>
                        </div>
                      </dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Ranked</dt>
                      <dd class="w-2/3">#{anime.rank || 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Popularity</dt>
                      <dd class="w-2/3">#{anime.popularity || 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Members</dt>
                      <dd class="w-2/3">{anime.members?.toLocaleString() || 'N/A'}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-gray-500">Favorites</dt>
                      <dd class="w-2/3">{anime.favorites?.toLocaleString() || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Trailer Modal -->
  {#if showTrailer && anime.trailer?.youtube_id}
    <div 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      on:click|self={() => showTrailer = false}
    >
      <div class="w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <div class="relative pt-[56.25%]">
          <iframe 
            src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}?autoplay=1`}
            class="absolute top-0 left-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <button 
            class="absolute -top-10 right-0 text-white hover:text-gray-300"
            on:click={() => showTrailer = false}
            aria-label="Close trailer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
