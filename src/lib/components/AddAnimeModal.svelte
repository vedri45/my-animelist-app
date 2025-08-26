<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { searchAnime } from '$lib/api/jikan';
  
  const dispatch = createEventDispatcher();
  
  let searchQuery = '';
  let searchResults: any[] = [];
  let isLoading = false;
  let selectedAnime: any = null;
  let formData = {
    status: 'plan_to_watch',
    score: 0,
    progress: 0,
    totalEpisodes: 0,
    notes: ''
  };
  
  const statusOptions = [
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'plan_to_watch', label: 'Plan to Watch' }
  ];
  
  async function searchAnimeResults() {
    if (!searchQuery.trim()) return;
    
    isLoading = true;
    try {
      // Use proper search API instead of filtering top anime
      const results = await searchAnime(searchQuery, 1);
      searchResults = results.slice(0, 10);
    } catch (error) {
      console.error('Search failed:', error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  }
  
  function selectAnime(anime: any) {
    selectedAnime = anime;
    formData.totalEpisodes = anime.episodes || 0;
    searchResults = [];
    // searchQuery = anime.title;
  }
  
  async function addAnime() {
    if (!selectedAnime) return;
    
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          malId: selectedAnime.mal_id,
          title: selectedAnime.title,
          imageUrl: selectedAnime.images.jpg.large_image_url || selectedAnime.images.jpg.image_url,
          ...formData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        dispatch('animeAdded', result.entry);
        closeModal();
      } else {
        console.error('Failed to add anime');
      }
    } catch (error) {
      console.error('Error adding anime:', error);
    }
  }
  
  function closeModal() {
    dispatch('close');
  }
  
  // Remove the backdrop click handler since we only want to close via buttons
  
  // Search when query changes (with debounce)
  let searchTimeout: NodeJS.Timeout;
  $: {
    clearTimeout(searchTimeout);
    if (searchQuery.trim()) {
      searchTimeout = setTimeout(searchAnimeResults, 300);
    } else {
      searchResults = [];
    }
  }
</script>

<!-- Modal Backdrop - now transparent with blur and no click to close -->
<div class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Add Anime to Watch List</h2>
        <button
          on:click={closeModal}
          class="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="px-6 py-4">
      <!-- Search Section -->
      <div class="mb-6">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Anime</label>
        <div class="relative">
          <input
            id="search"
            type="text"
            bind:value={searchQuery}
            placeholder="Enter anime title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {#if isLoading}
            <div class="absolute right-3 top-2.5">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            </div>
          {/if}
        </div>
        
        <!-- Search Results -->
        {#if searchResults.length > 0}
          <div class="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
            {#each searchResults as anime}
              <button
                on:click={() => selectAnime(anime)}
                class="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              >
                {#if anime.images?.jpg?.image_url}
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    class="w-12 h-16 object-cover rounded"
                  />
                {/if}
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 truncate">{anime.title}</div>
                  <div class="text-sm text-gray-500">
                    {anime.type} • {anime.episodes || '?'} eps • {anime.year || '?'}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Form Section -->
      {#if selectedAnime}
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Add "{selectedAnime.title}"</h3>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                bind:value={formData.status}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {#each statusOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label for="score" class="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                id="score"
                type="number"
                min="0"
                max="10"
                step="0.5"
                bind:value={formData.score}
                class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="progress" class="block text-sm font-medium text-gray-700 mb-1">Progress</label>
              <input
                id="progress"
                type="number"
                min="0"
                bind:value={formData.progress}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label for="totalEpisodes" class="block text-sm font-medium text-gray-700 mb-1">Total Episodes</label>
              <input
                id="totalEpisodes"
                type="number"
                min="0"
                bind:value={formData.totalEpisodes}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div class="mb-6">
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add your thoughts about this anime..."
            ></textarea>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
      <button
        on:click={closeModal}
        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        Cancel
      </button>
      {#if selectedAnime}
        <button
          on:click={addAnime}
          class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
        >
          Add to Watch List
        </button>
      {/if}
    </div>
  </div>
</div>
