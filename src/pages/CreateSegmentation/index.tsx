import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSegmentData } from "@/context/SegmentDataContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CreateSegmentation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { CONNECTION_EXPIRY_KEY } = useSegmentData();
    const connection = localStorage.getItem(CONNECTION_EXPIRY_KEY)

    return (
        <DashboardShell>
            {!connection ? (
                <div className="flex flex-col gap-6 items-center justify-center h-[60vh]">
                    <Alert variant="destructive" className="max-w-md text-center">
                        <AlertTitle>Database Connection Required</AlertTitle>
                        <AlertDescription>
                            No data has been imported. Please navigate to the Import Data page to connect to your database.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => navigate("/import-data")} className="mt-4">
                        Go to Import Data
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-bold tracking-tight">Create Segmentation</h1>
                    <Tabs
                        defaultValue="user-create"
                        value={["user-create", "ai-create"].includes(location.pathname.split("/").pop()) ? location.pathname.split("/").pop() : "user-create"}
                        onValueChange={(value) => navigate(`/create-segmentation/${value}`)}
                    >
                        <TabsList className="bg-card-foreground">
                            <TabsTrigger className="text-card" value="user-create">User Create</TabsTrigger>
                            <TabsTrigger className="text-card" value="ai-create">AI Support Create</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Outlet />
                </div>
            )}
        </DashboardShell>
    );
}
