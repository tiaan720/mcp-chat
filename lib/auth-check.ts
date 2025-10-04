import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Check if the authenticated user has access to the application.
 * Users need to have the "approved" metadata set to true by an admin.
 * 
 * @returns Object with userId and hasAccess boolean
 */
export async function checkUserAccess(): Promise<{ userId: string | null; hasAccess: boolean }> {
  const { userId } = await auth();

  if (!userId) {
    return { userId: null, hasAccess: false };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Check if user has been approved via public metadata
    const isApproved = user.publicMetadata?.approved === true;
    
    return { userId, hasAccess: isApproved };
  } catch (error) {
    console.error("Error checking user access:", error);
    return { userId, hasAccess: false };
  }
}

/**
 * Approve a user by setting their approved metadata to true.
 * This should only be called by admins.
 */
export async function approveUser(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        approved: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Error approving user:", error);
    return false;
  }
}
