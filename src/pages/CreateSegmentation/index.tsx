import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSegmentData } from "@/context/SegmentDataContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CreateSegmentation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <DashboardShell>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Tạo Phân Khúc Khách Hàng</h1>
                <Tabs
                    defaultValue="user-create"
                    value={["user-create", "ai-create"].includes(location.pathname.split("/").pop()) ? location.pathname.split("/").pop() : "user-create"}
                    onValueChange={(value) => navigate(`/create-segmentation/${value}`)}
                >
                    <TabsList className="bg-card-foreground">
                        <TabsTrigger className="text-card" value="user-create">Tạo bởi người dùng</TabsTrigger>
                        <TabsTrigger className="text-card" value="ai-create">Tạo bởi AI hỗ trợ</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Outlet />
            </div>
        </DashboardShell>
    );
}
