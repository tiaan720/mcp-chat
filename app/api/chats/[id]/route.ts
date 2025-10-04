import { NextResponse } from "next/server";
import { getChatById, deleteChat } from "@/lib/chat-store";
import { checkUserAccess } from "@/lib/auth-check";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    // Get the authenticated user from Clerk and check access
    const { userId, hasAccess } = await checkUserAccess();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - please sign in" }, { status: 401 });
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied - your account needs to be approved" }, { status: 403 });
    }

    const { id } = await params;
    const chat = await getChatById(id, userId);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Get the authenticated user from Clerk and check access
    const { userId, hasAccess } = await checkUserAccess();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - please sign in" }, { status: 401 });
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied - your account needs to be approved" }, { status: 403 });
    }

    const { id } = await params;
    await deleteChat(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
} 