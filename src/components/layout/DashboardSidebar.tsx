
import { Home, Users, PieChart, Layers, Settings, Database, Moon, Sun } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/dark-mode/ThemeProvider";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Customer Analysis",
    icon: Users,
    path: "/customers",
  },
  {
    title: "RFM Analysis",
    icon: PieChart,
    path: "/rfm",
  },
  {
    title: "Segmentation",
    icon: Layers,
    path: "/segments",
  },
  {
    title: "Data Sync",
    icon: Database,
    path: "/sync",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarContent>
        <a href="/" className="p-6">
          <h1 className="text-2xl font-semibold text-primary">RetailSight</h1>
        </a>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={location.pathname === item.path ? "bg-primary-light text-primary" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}