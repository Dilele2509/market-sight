
import { Home, Users, PieChart, Layers, RefreshCcwDot, Settings, Database, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
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
    title: "Customer Lifecycle",
    icon: RefreshCcwDot,
    path: "/lifecycle",
  },
  {
    title: "Segmentation",
    icon: Layers,
    path: "/segmentation",
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

const DashboardSidebar = ({ isCollapsed, updateCollapsedStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between p-6">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <h1 className="text-2xl font-semibold text-primary">RetailSight</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateCollapsedStatus(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{!isCollapsed && "Analytics"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    tooltip={isCollapsed ? item.title : undefined}
                    onClick={() => navigate(item.path)}
                    data-active={location.pathname === item.path}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.title}</span>}
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
          size={isCollapsed ? "icon" : "default"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
