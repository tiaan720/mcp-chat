import { NextResponse } from "next/server";
import { getChats } from "@/lib/chat-store";
import { checkUserAccess } from "@/lib/auth-check";

export async function GET(request: Request) {
  try {
    // Get the authenticated user from Clerk and check access
    const { userId, hasAccess } = await checkUserAccess();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - please sign in" }, { status: 401 });
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied - your account needs to be approved" }, { status: 403 });
    }

    const chats = await getChats(userId);
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
} 