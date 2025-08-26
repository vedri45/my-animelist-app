<script lang="ts">
  import { authStore, clearUser } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Use auth store if available, otherwise fall back to page data
  let user = $derived($authStore.user || $page.data.user);
  
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Clear user from store immediately
      clearUser();
      
      // Redirect to home page after logout
      goto('/');
    } catch (error) {
      console.error('Logout error:', error);
      clearUser();
      goto('/');
    }
  }
</script>

<nav class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-indigo-600">
            MyAnimeList
          </a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="/" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Home
          </a>
          <a href="/anime" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Anime
          </a>
        </div>
      </div>
      
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if user}
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 text-sm">Welcome, {user.username}!</span>
            <button
              on:click={handleLogout}
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        {:else}
          <div class="flex items-center space-x-4">
            <a
              href="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign in
            </a>
            <a
              href="/register"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign up
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>
