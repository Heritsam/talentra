import {
  BriefcaseIcon,
  ChartBarLineIcon,
  GridViewIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={1.5} />,
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: <HugeiconsIcon icon={BriefcaseIcon} strokeWidth={1.5} />,
    },
    {
      title: "Candidates",
      url: "/candidates",
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.5} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3 group-data-[collapsible=icon]:hidden:p-1!">
          <div className="h-5 w-5 bg-primary" />
          <span className="font-bold font-mono text-sm uppercase tracking-widest group-data-[collapsible=icon]:hidden">
            Talentra
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
