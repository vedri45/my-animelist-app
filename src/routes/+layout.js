import { authStore } from '$lib/stores/auth';

export function load({ data }) {
  // Initialize auth store with server data
  authStore.set({ user: data.user || null });
  
  return data;
}
