import { writable } from 'svelte/store';
import type { SessionUser } from '$lib/types/auth';

export const authStore = writable<{ user: SessionUser | null }>({
  user: null
});

export function setUser(user: SessionUser | null) {
  authStore.update(state => ({ ...state, user }));
}

export function clearUser() {
  authStore.update(state => ({ ...state, user: null }));
}
