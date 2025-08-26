<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  
  export let anime: any;
  
  const dispatch = createEventDispatcher();
  
  let isEditing = false;
  let editForm = {
    status: anime.status,
    score: anime.score || 0,
    progress: anime.progress || 0,
    totalEpisodes: anime.totalEpisodes || 0,
    notes: anime.notes || ''
  };
  
  const statusOptions = [
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'plan_to_watch', label: 'Plan to Watch' }
  ];
  
  const statusColors = {
    watching: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    dropped: 'bg-red-100 text-red-800',
    plan_to_watch: 'bg-gray-100 text-gray-800'
  };
  
  function startEdit() {
    isEditing = true;
    editForm = {
      status: anime.status,
      score: anime.score || 0,
      progress: anime.progress || 0,
      totalEpisodes: anime.totalEpisodes || 0,
      notes: anime.notes || ''
    };
  }
  
  function cancelEdit() {
    isEditing = false;
  }
  
  async function saveEdit() {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          malId: anime.malId,
          title: anime.title,
          imageUrl: anime.imageUrl,
          ...editForm
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        dispatch('animeUpdated', result.entry);
        isEditing = false;
      } else {
        console.error('Failed to update anime');
      }
    } catch (error) {
      console.error('Error updating anime:', error);
    }
  }
  
  async function deleteAnime() {
    if (!confirm('Are you sure you want to remove this anime from your list?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/watchlist/${anime.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        dispatch('animeDeleted', anime.id);
      } else {
        console.error('Failed to delete anime');
      }
    } catch (error) {
      console.error('Error deleting anime:', error);
    }
  }
</script>

<div class="px-6 py-4 hover:bg-gray-50 transition-colors">
  {#if isEditing}
    <!-- Edit Form -->
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            bind:value={editForm.status}
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
            bind:value={editForm.score}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="progress" class="block text-sm font-medium text-gray-700 mb-1">Progress</label>
          <input
            id="progress"
            type="number"
            min="0"
            bind:value={editForm.progress}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label for="totalEpisodes" class="block text-sm font-medium text-gray-700 mb-1">Total Episodes</label>
          <input
            id="totalEpisodes"
            type="number"
            min="0"
            bind:value={editForm.totalEpisodes}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          id="notes"
          bind:value={editForm.notes}
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add your thoughts about this anime..."
        ></textarea>
      </div>
      
      <div class="flex justify-end gap-2">
        <button
          on:click={cancelEdit}
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={saveEdit}
          class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  {:else}
    <!-- Display View -->
    <div class="flex items-start gap-4">
      {#if anime.imageUrl}
        <img
          src={anime.imageUrl}
          alt={anime.title}
          class="w-16 h-24 object-cover rounded-md flex-shrink-0"
        />
      {/if}
      
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-gray-900 truncate">{anime.title}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[anime.status]}`}>
                {statusOptions.find(opt => opt.value === anime.status)?.label}
              </span>
              {#if anime.score}
                <span class="text-sm text-gray-600">
                  ★ {anime.score}
                </span>
              {/if}
            </div>
            
            <div class="mt-2 text-sm text-gray-600">
              {#if anime.totalEpisodes}
                <span>Progress: {anime.progress || 0}/{anime.totalEpisodes} episodes</span>
              {:else}
                <span>Progress: {anime.progress || 0} episodes</span>
              {/if}
            </div>
            
            {#if anime.notes}
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">{anime.notes}</p>
            {/if}
          </div>
          
          <div class="flex items-center gap-2 ml-4">
            <button
              on:click={startEdit}
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              on:click={deleteAnime}
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 11 2 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
