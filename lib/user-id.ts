import { nanoid } from 'nanoid';

const USER_ID_KEY = 'ai-chat-user-id';

/**
 * Get the user ID from Clerk authentication or localStorage fallback.
 * This function is for client-side use only.
 * For server-side, use auth() from @clerk/nextjs/server
 */
export function getUserId(): string {
  // Only run this on the client side
  if (typeof window === 'undefined') return '';

  // Check if we have a Clerk user ID first (from window.__clerk_user_id if needed)
  // For now, fallback to localStorage for backward compatibility
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // Generate a new user ID and store it
    userId = nanoid();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

export function updateUserId(newUserId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, newUserId);
}

/**
 * Set the user ID in localStorage.
 * This should be called when a user signs in with Clerk.
 */
export function setUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, userId);
}
 