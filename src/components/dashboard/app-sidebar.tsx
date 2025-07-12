"use client";

import * as React from "react";
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
import { DashboardRoutes } from "@/constants/dashboard-routes";
import Image from "next/image";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: string;
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const {
    adminNavMain,
    adminNavSecondary,
    ownerNavMain,
    ownerNavSecondary,
    riderNavMain,
    riderNavSecondary,
  } = DashboardRoutes;

  let navMain = adminNavMain;
  let navSecondary = adminNavSecondary;

  if (role === "RESTATURANT_OWNER") {
    navMain = ownerNavMain;
    navSecondary = ownerNavSecondary;
  } else if (role === "RIDER") {
    navMain = riderNavMain;
    navSecondary = riderNavSecondary;
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dash" className="cursor-pointer flex items-center">
                <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
                <span className="text-base font-semibold ml-2">Food IT</span>
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
