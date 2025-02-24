import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useState } from "react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <div className={`duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
          <DashboardSidebar isCollapsed={isCollapsed} updateCollapsedStatus={setIsCollapsed} />
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
