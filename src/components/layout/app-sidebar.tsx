import { Home, Inbox, Search, Settings, Beer, Contact, SprayCan } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";

const navigationItems = [
  {
    title: "Home",
    url: "/", // Root route
    icon: Home,
  },
  {
    title: "About",
    url: "/about", // About page route
    icon: Search,
  },
  {
    title: "Skills",
    url: "/skills", // Skills page route
    icon: Beer,
  },
  {
    title: "Blog",
    url: "/blog", // Blog page route
    icon: Inbox,
  },
  {
    title: "Portfolio",
    url: "/portfolio", // Settings page route
    icon: SprayCan,
  },
  {
    title: "Contact",
    url: "/contact", // Contact page route
    icon: Contact,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Theme Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ThemeToggle />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
