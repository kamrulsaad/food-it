"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

export function NavUser() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
            <AvatarFallback className="rounded-full">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.fullName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
