import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MicroSegmentation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <DashboardShell>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Micro Segmentation</h1>
                </div>
                <div className="flex items-center">
                    <Tabs
                        defaultValue="rfm"
                        value={["rfm", "lifecycle"].includes(location.pathname.split("/").pop()) ? location.pathname.split("/").pop() : "rfm"}
                        onValueChange={(value) => navigate(`/micro-segmentation/${value}`)}
                    >
                        <TabsList className="bg-card-foreground">
                            <TabsTrigger className="text-card" value="rfm">RFM Analysis</TabsTrigger>
                            <TabsTrigger className="text-card" value="lifecycle">Customer Lifecycle Analysis</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Outlet để hiển thị nội dung của từng trang */}
                <Outlet />
            </div>
        </DashboardShell>
    );
}
