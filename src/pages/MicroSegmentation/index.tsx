import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSegmentData } from "@/context/SegmentDataContext";

export default function MicroSegmentation() {
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
                    <Button onClick={() => navigate("/connect-data")} className="mt-4">
                        Go to Import Data
                    </Button>
                </div>
            ) : (<div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Micro-Segmentation</h1>
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

                <Outlet />
            </div>)}
        </DashboardShell>
    );
}

