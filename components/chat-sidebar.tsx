"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  PlusCircle,
  Trash2,
  ServerIcon,
  Settings,
  Sparkles,
  Key,
  Flame,
  Sun,
  CircleDashed,
  Zap,
  Square,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { MCPServerManager } from "./mcp-server-manager";
import { ApiKeyManager } from "./api-key-manager";
import { ThemeToggle } from "./theme-toggle";
import { AnimatedLogoWithText } from "./animated-logo";
import { useTheme } from "next-themes";
import { setUserId } from "@/lib/user-id";
import { useChats } from "@/lib/hooks/use-chats";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useMCP } from "@/lib/context/mcp-context";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useUser, UserButton } from "@clerk/nextjs";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mcpSettingsOpen, setMcpSettingsOpen] = useState(false);
  const [apiKeySettingsOpen, setApiKeySettingsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { setTheme } = useTheme();

  // Get MCP server data from context
  const {
    mcpServers,
    setMcpServers,
    selectedMcpServers,
    setSelectedMcpServers,
  } = useMCP();

  // Get userId from Clerk and store it in localStorage
  const userId = user?.id || '';
  
  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
    }
  }, [isLoaded, user]);

  // Use TanStack Query to fetch chats
  const { chats, isLoading, deleteChat, refreshChats } = useChats(userId);

  // Start a new chat
  const handleNewChat = () => {
    router.push("/");
  };

  // Delete a chat
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    deleteChat(chatId);

    // If we're currently on the deleted chat's page, navigate to home
    if (pathname === `/chat/${chatId}`) {
      router.push("/");
    }
  };

  // Get active MCP servers status
  const activeServersCount = selectedMcpServers.length;

  // Show loading state if user is not yet loaded
  if (!isLoaded || !user) {
    return null; // Or a loading spinner
  }

  // Create chat loading skeletons
  const renderChatSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <SidebarMenuItem key={`skeleton-${index}`}>
          <div
            className={`flex items-center gap-2 px-3 py-2 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <Skeleton className="h-4 w-4 rounded-full" />
            {!isCollapsed && (
              <>
                <Skeleton className="h-4 w-full max-w-[180px]" />
                <Skeleton className="h-5 w-5 ml-auto rounded-md flex-shrink-0" />
              </>
            )}
          </div>
        </SidebarMenuItem>
      ));
  };

  return (
    <Sidebar
      className="shadow-sm bg-background/80 dark:bg-background/40 backdrop-blur-md"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-start">
          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <AnimatedLogoWithText collapsed={isCollapsed} />
            {!isCollapsed && (
              <div className="font-semibold text-lg text-foreground/90">
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-[calc(100vh-8rem)]">
        <SidebarGroup className="flex-1 min-h-0">
          <SidebarGroupLabel
            className={cn(
              "px-4 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider",
              isCollapsed ? "sr-only" : ""
            )}
          >
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent
            className={cn(
              "overflow-y-auto pt-1",
              isCollapsed ? "overflow-x-hidden" : ""
            )}
          >
            <SidebarMenu>
              {isLoading ? (
                renderChatSkeletons()
              ) : chats.length === 0 ? (
                <div
                  className={`flex items-center justify-center py-3 ${
                    isCollapsed ? "" : "px-4"
                  }`}
                >
                  {isCollapsed ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-background/50">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full px-3 py-2 rounded-md border border-dashed border-border/50 bg-background/50">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-normal">
                        No conversations yet
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={isCollapsed ? chat.title : undefined}
                          data-active={pathname === `/chat/${chat.id}`}
                          className={cn(
                            "transition-all hover:bg-primary/10 active:bg-primary/15",
                            pathname === `/chat/${chat.id}`
                              ? "bg-orange-500/15 hover:bg-orange-500/20 slate:bg-orange-500/20 slate:hover:bg-orange-500/25 border-l-2 border-orange-500"
                              : ""
                          )}
                        >
                          <Link
                            href={`/chat/${chat.id}`}
                            className="flex items-center justify-between w-full gap-1"
                          >
                            <div className="flex items-center min-w-0 overflow-hidden flex-1 pr-2">
                              <MessageSquare
                                className={cn(
                                  "h-4 w-4 flex-shrink-0",
                                  pathname === `/chat/${chat.id}`
                                    ? "text-orange-500 slate:text-orange-400"
                                    : "text-muted-foreground"
                                )}
                              />
                              {!isCollapsed && (
                                <span
                                  className={cn(
                                    "ml-2 truncate text-sm",
                                    pathname === `/chat/${chat.id}`
                                      ? "text-orange-500 slate:text-orange-400 font-medium"
                                      : "text-foreground/80"
                                  )}
                                  title={chat.title}
                                >
                                  {chat.title.length > 18
                                    ? `${chat.title.slice(0, 18)}...`
                                    : chat.title}
                                </span>
                              )}
                            </div>
                            {!isCollapsed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-6 w-6 flex-shrink-0 transition-colors",
                                  pathname === `/chat/${chat.id}`
                                    ? "text-orange-500/60 hover:text-orange-500 hover:bg-orange-500/20 slate:text-orange-400/60 slate:hover:text-orange-400 slate:hover:bg-orange-500/30"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                title="Delete chat"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="relative my-0">
          <div className="absolute inset-x-0">
            <Separator className="w-full h-px bg-border/40" />
          </div>
        </div>

        <SidebarGroup className="flex-shrink-0">
          <SidebarGroupLabel
            className={cn(
              "px-4 pt-0 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider",
              isCollapsed ? "sr-only" : ""
            )}
          >
            MCP Servers
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setMcpSettingsOpen(true)}
                  className={cn(
                    "w-full flex items-center gap-2 transition-all",
                    "hover:bg-secondary/50 active:bg-secondary/70"
                  )}
                  tooltip={isCollapsed ? "MCP Servers" : undefined}
                >
                  <ServerIcon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      activeServersCount > 0
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-grow text-sm text-foreground/80">
                      MCP Servers
                    </span>
                  )}
                  {activeServersCount > 0 && !isCollapsed ? (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] px-1.5 py-0 h-5 bg-secondary/80"
                    >
                      {activeServersCount}
                    </Badge>
                  ) : activeServersCount > 0 && isCollapsed ? (
                    <SidebarMenuBadge className="bg-secondary/80 text-secondary-foreground">
                      {activeServersCount}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40 mt-auto">
        <div
          className={`flex flex-col ${isCollapsed ? "items-center" : ""} gap-3`}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="default"
              className={cn(
                "w-full bg-primary text-primary-foreground hover:bg-primary/90",
                isCollapsed ? "w-8 h-8 p-0" : ""
              )}
              onClick={handleNewChat}
              title={isCollapsed ? "New Chat" : undefined}
            >
              <PlusCircle className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
              {!isCollapsed && <span>New Chat</span>}
            </Button>
          </motion.div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between font-normal bg-transparent border border-border/60 shadow-none h-10 hover:bg-secondary/50",
                  isCollapsed ? "w-8 h-8 p-0" : "px-2"
                )}
              >
                <div className="flex items-center gap-2">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: isCollapsed ? "h-6 w-6" : "h-7 w-7"
                      }
                    }}
                  />
                  {!isCollapsed && (
                    <div className="grid text-left text-sm leading-tight">
                      <span className="truncate font-medium text-foreground/90">
                        {user.primaryEmailAddress?.emailAddress || user.username || 'User'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        Manage account
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              side={isCollapsed ? "top" : "top"}
              align={isCollapsed ? "start" : "end"}
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground/90">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setMcpSettingsOpen(true);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                  MCP Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setApiKeySettingsOpen(true);
                  }}
                >
                  <Key className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                  API Keys
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme("dark")}>
                      <Flame className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme("sunset")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Sunset</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme("black")}>
                      <CircleDashed className="mr-2 h-4 w-4" />
                      <span>Black</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme("tron")}>
                      <Zap className="mr-2 h-4 w-4" />
                      <span>Tron</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTheme("slate")}>
                      <Square className="mr-2 h-4 w-4" />
                      <span>Slate</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <MCPServerManager
          servers={mcpServers}
          onServersChange={setMcpServers}
          selectedServers={selectedMcpServers}
          onSelectedServersChange={setSelectedMcpServers}
          open={mcpSettingsOpen}
          onOpenChange={setMcpSettingsOpen}
        />

        <ApiKeyManager
          open={apiKeySettingsOpen}
          onOpenChange={setApiKeySettingsOpen}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
