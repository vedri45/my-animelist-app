<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { page } from '$app/stores';
  
  // Use auth store if available, otherwise fall back to page data
  let user = $derived($authStore.user || $page.data.user);
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="text-center">
    <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
      Welcome to <span class="text-indigo-600">MyAnimeList</span>
    </h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
      Track your anime watching progress, discover new shows, and manage your personal anime collection.
    </p>
    
    {#if user}
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="rounded-md shadow">
          <a href="/anime" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Browse Anime
          </a>
        </div>
        <div class="rounded-md shadow">
          <a href="/watchlist" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
            My Watch List
          </a>
        </div>
      </div>
    {:else}
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <div class="rounded-md shadow">
          <a href="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Get Started
          </a>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <a href="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            Sign In
          </a>
        </div>
      </div>
    {/if}
  </div>
  
  {#if user}
    <div class="mt-12">
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Welcome back, {user.username}!
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Your anime journey continues here.
          </p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <p class="text-sm text-gray-600">
            You're signed in with email: {user.email}
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
