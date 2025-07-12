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
  const { adminNavMain, ownerNavMain, riderNavMain } = DashboardRoutes;

  let navMain = adminNavMain;

  if (role === "RESTATURANT_OWNER") {
    navMain = ownerNavMain;
  } else if (role === "RIDER") {
    navMain = riderNavMain;
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
        <NavSecondary className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
