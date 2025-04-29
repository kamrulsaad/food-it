"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconBuildingStore,
  IconBike,
  IconSettings,
  IconUsers,
  IconClipboardPlus,
  IconBuildingWarehouse,
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: string;
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const adminNavMain = [
    {
      title: "Dashboard",
      url: "/dash/charts",
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
  ];

  const ownerNavMain = [
    {
      title: "Dashboard",
      url: "/dash/charts",
      icon: IconDashboard,
    },
    {
      title: "My Menu Items",
      url: "/dash/menu",
      icon: IconClipboardPlus,
    },
    {
      title: "Restaurant Settings",
      url: "/dash/restaurant-settings",
      icon: IconBuildingWarehouse,
    },
    {
      title: "Orders",
      url: "/dash/orders",
      icon: IconListDetails,
    },
  ];

  const adminNavSecondary = [
    {
      title: "Settings",
      url: "/dash/settings",
      icon: IconSettings,
    },
  ];

  const ownerNavSecondary = [
    {
      title: "Profile Settings",
      url: "/dash/settings",
      icon: IconSettings,
    },
  ];

  const navMain = role === "RESTATURANT_OWNER" ? ownerNavMain : adminNavMain;
  const navSecondary = role === "RESTATURANT_OWNER" ? ownerNavSecondary : adminNavSecondary;

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
                  Food IT Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
