import { Home, Users, PieChart, Layers, Settings, Database, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
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

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  isActive={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.title}
                  <item.icon className="mr-2 h-4 w-4" />
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleCollapse}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
