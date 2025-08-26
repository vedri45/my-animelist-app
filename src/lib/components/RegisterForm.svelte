<script lang="ts">
  import { goto } from '$app/navigation';
  import { setUser } from '$lib/stores/auth';
  
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let fieldErrors: Record<string, string> = {};
  
  function validateForm() {
    fieldErrors = {};
    
    if (!username) fieldErrors.username = 'Username is required';
    else if (username.length < 3) fieldErrors.username = 'Username must be at least 3 characters long';
    
    if (!email) fieldErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Please enter a valid email address';
    
    if (!password) fieldErrors.password = 'Password is required';
    else if (password.length < 6) fieldErrors.password = 'Password must be at least 6 characters long';
    
    if (!confirmPassword) fieldErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) fieldErrors.confirmPassword = 'Passwords do not match';
    
    return Object.keys(fieldErrors).length === 0;
  }
  
  async function handleRegister() {
    if (!validateForm()) {
      error = 'Please fix the errors above';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirmPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.field) {
          fieldErrors[data.field] = data.message;
        } else {
          error = data.message || 'Registration failed';
        }
        return;
      }
      
      // Update auth store immediately with user data
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email
      });
      
      // Redirect to home page on successful registration
      goto('/');
    } catch (err) {
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          sign in to your account
        </a>
      </p>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            bind:value={username}
            id="username"
            name="username"
            type="text"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm {fieldErrors.username ? 'border-red-500' : ''}"
            placeholder="Enter username"
          />
          {#if fieldErrors.username}
            <p class="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
          {/if}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <input
            bind:value={email}
            id="email"
            name="email"
            type="email"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm {fieldErrors.email ? 'border-red-500' : ''}"
            placeholder="Enter email"
          />
          {#if fieldErrors.email}
            <p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          {/if}
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            bind:value={password}
            id="password"
            name="password"
            type="password"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm {fieldErrors.password ? 'border-red-500' : ''}"
            placeholder="Enter password"
          />
          {#if fieldErrors.password}
            <p class="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          {/if}
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            bind:value={confirmPassword}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm {fieldErrors.confirmPassword ? 'border-red-500' : ''}"
            placeholder="Confirm password"
          />
          {#if fieldErrors.confirmPassword}
            <p class="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
          {/if}
        </div>
      </div>

      {#if error}
        <div class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {error}
          </div>
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {/if}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </form>
  </div>
</div>
