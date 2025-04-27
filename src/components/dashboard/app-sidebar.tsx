"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconBuildingStore,
  IconBike,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Updated relevant data
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg", // you can replace this with your admin avatar later
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dash",
      icon: IconDashboard,
    },
    {
      title: "Restaurants",
      url: "/dash/restaurants",
      icon: IconBuildingStore,
    },
    {
      title: "Riders",
      url: "/dash/riders",
      icon: IconBike,
    },
    {
      title: "Customers",
      url: "/dash/customers",
      icon: IconUsers,
    },
    {
      title: "Orders",
      url: "/dash/orders",
      icon: IconListDetails,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dash/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dash" className="cursor-pointer">
                <IconBuildingStore className="!size-5" />
                <span className="text-base font-semibold ml-2">
                  Food IT Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
