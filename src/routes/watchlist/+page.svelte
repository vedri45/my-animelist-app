<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import WatchlistSection from '$lib/components/WatchlistSection.svelte';
  import AddAnimeModal from '$lib/components/AddAnimeModal.svelte';
  
  export let data: PageData;
  
  let showAddModal = false;
  let watchlist = data.watchlist;
  let groupedWatchlist = data.groupedWatchlist;
  let activeTab: StatusType = 'watching';
  
  type StatusType = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  
  const statusLabels: Record<StatusType, string> = {
    watching: 'Currently Watching',
    completed: 'Completed',
    on_hold: 'On Hold',
    dropped: 'Dropped',
    plan_to_watch: 'Plan to Watch'
  };
  
  const statusColors: Record<StatusType, string> = {
    watching: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    dropped: 'bg-red-100 text-red-800',
    plan_to_watch: 'bg-gray-100 text-gray-800'
  };
  
  async function handleAnimeAdded(event: CustomEvent<any>) {
    const newEntry = event.detail;
    // Add to the appropriate status group
    const status = newEntry.status as StatusType;
    if (!groupedWatchlist[status]) {
      groupedWatchlist[status] = [];
    }
    groupedWatchlist[status] = [newEntry, ...groupedWatchlist[status]];
    
    // Also add to the main watchlist
    watchlist = [newEntry, ...watchlist];
    
    showAddModal = false;
  }
  
  async function handleAnimeUpdated(event: CustomEvent<any>) {
    const updatedEntry = event.detail;
    // Remove from old status group
    const oldStatus = watchlist.find(entry => entry.id === updatedEntry.id)?.status as StatusType;
    if (oldStatus) {
      groupedWatchlist[oldStatus] = groupedWatchlist[oldStatus].filter(entry => entry.id !== updatedEntry.id);
    }
    
    // Add to new status group
    const newStatus = updatedEntry.status as StatusType;
    if (!groupedWatchlist[newStatus]) {
      groupedWatchlist[newStatus] = [];
    }
    groupedWatchlist[newStatus] = [updatedEntry, ...groupedWatchlist[newStatus]];
    
    // Update main watchlist
    watchlist = watchlist.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry);
  }
  
  async function handleAnimeDeleted(event: CustomEvent<any>) {
    const entryId = event.detail;
    // Remove from all groups and main watchlist
    const entry = watchlist.find(e => e.id === entryId);
    if (entry) {
      const status = entry.status as StatusType;
      groupedWatchlist[status] = groupedWatchlist[status].filter(e => e.id !== entryId);
      watchlist = watchlist.filter(e => e.id !== entryId);
    }
  }
</script>

<svelte:head>
  <title>My Watch List - MyAnimeList</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900">My Watch List</h1>
    <button
      on:click={() => showAddModal = true}
      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      Add Anime
    </button>
  </div>
  
  {#if watchlist.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Your watch list is empty</h3>
      <p class="text-gray-500 mb-6">Start building your anime collection by adding shows you want to watch.</p>
      <button
        on:click={() => showAddModal = true}
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Add Your First Anime
      </button>
    </div>
  {:else}
    <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8 overflow-x-auto">
      {#each Object.entries(statusLabels) as [status, label]}
        {#if groupedWatchlist[status as StatusType]?.length > 0}
          <button
            class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === status 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            on:click={() => activeTab = status as StatusType}
          >
            {label} ({groupedWatchlist[status as StatusType]?.length || 0})
          </button>
        {/if}
    {/each}
    </nav>
  </div>

  <div class="mt-6">
    {#if groupedWatchlist[activeTab]?.length > 0}
      <WatchlistSection
        animeList={groupedWatchlist[activeTab]}
        title={statusLabels[activeTab]}
        colorClass={statusColors[activeTab]}
        on:animeUpdated={handleAnimeUpdated}
        on:animeDeleted={handleAnimeDeleted}
      />
    {:else}
      <div class="text-center py-12 bg-gray-50 rounded-lg">
        <div class="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No {statusLabels[activeTab]?.toLowerCase()} anime</h3>
        <p class="text-gray-500 mb-4">You don't have any anime in this category yet.</p>
        <button
          on:click={() => showAddModal = true}
          class="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Add an anime to get started
        </button>
      </div>
    {/if}
  </div>
  {/if}
</div>

{#if showAddModal}
  <AddAnimeModal
    on:close={() => showAddModal = false}
    on:animeAdded={handleAnimeAdded}
  />
{/if}
