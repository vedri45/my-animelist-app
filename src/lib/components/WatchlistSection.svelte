<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import WatchlistEntry from './WatchlistEntry.svelte';
  
  export let animeList: any[];
  export let title: string;
  export let colorClass: string;
  
  const dispatch = createEventDispatcher();
  
  function handleAnimeUpdated(event: CustomEvent) {
    dispatch('animeUpdated', event.detail);
  }
  
  function handleAnimeDeleted(event: CustomEvent) {
    dispatch('animeDeleted', event.detail);
  }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-gray-900">{title}</h2>
        <span class="px-2.5 py-0.5 text-sm font-medium rounded-full {colorClass}">
          {animeList.length}
        </span>
      </div>
    </div>
  </div>
  
  <div class="divide-y divide-gray-200">
    {#each animeList as anime (anime.id)}
      <WatchlistEntry
        {anime}
        on:animeUpdated={handleAnimeUpdated}
        on:animeDeleted={handleAnimeDeleted}
      />
    {/each}
  </div>
</div>
