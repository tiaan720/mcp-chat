import Chat from "@/components/chat";
import { checkUserAccess } from "@/lib/auth-check";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { hasAccess } = await checkUserAccess();

  if (!hasAccess) {
    redirect("/access-denied");
  }

  return <Chat />;
}
