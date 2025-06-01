
import { LayoutDashboard, ChartNoAxesCombined, Cable, Moon, Sun, ChevronLeft, ChevronRight, Database, Filter, FolderSync } from "lucide-react";
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

const menuItems = [
  {
    title: "Bảng giám sát",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Phân khúc vi mô",
    icon: ChartNoAxesCombined,
    path: "/micro-segmentation",
  },
  {
    title: "Tạo phân khúc",
    icon: Filter,
    path: "/create-segmentation",
  },
  {
    title: "Chuẩn hoá dữ liệu",
    icon: Database,
    path: "/data-modeling",
  },
  {
    title: "Kết nối dữ liệu",
    icon: Cable,
    path: "/connect-data",
  },
  {
    title: "Cấu hình đồng bộ",
    icon: FolderSync,
    path: "/sync-config",
  },
];

const DashboardSidebar = ({ isCollapsed, updateCollapsedStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar className={`border-r border-border/50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
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
          <SidebarGroupLabel>{!isCollapsed && "Phân tích"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem className="hover:bg-primary hover:text-white hover:rounded-md cursor-pointer" key={item.path}>
                  <SidebarMenuButton
                    className="data-[active=true]:bg-primary-light data-[active=true]:text-primary"
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
              {!isCollapsed && <span>Chế độ sáng</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {!isCollapsed && <span>Chế độ tối</span>}
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
