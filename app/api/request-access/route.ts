import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in" },
        { status: 401 }
      );
    }

    // Get user details
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if already approved
    if (user.publicMetadata?.approved === true) {
      return NextResponse.json(
        { message: "You already have access" },
        { status: 200 }
      );
    }

    // Mark that user has requested access
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        accessRequested: true,
        accessRequestedAt: new Date().toISOString(),
      },
    });

    // In a production app, you'd send an email/notification to admins here
    console.log(`Access requested by user: ${user.primaryEmailAddress?.emailAddress || user.username} (${userId})`);

    return NextResponse.json(
      { message: "Access request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error requesting access:", error);
    return NextResponse.json(
      { error: "Failed to submit access request" },
      { status: 500 }
    );
  }
}
