import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMicroSegmentation } from "@/context/MicroSegmentationContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSegmentData } from "@/context/SegmentDataContext";

const segmentationData = {
    market: [
        { stage: "New", name: "Champions", value: 234, percentage: 20, recency: 5, frequency: 5, customers: 150, gmv: 45000, orders: 520 },
        { stage: "Early-life", name: "Loyal", value: 189, percentage: 15, recency: 4, frequency: 5, customers: 134, gmv: 62000, orders: 720 },
        { stage: "Mature", name: "At Risk", value: 142, percentage: 12, recency: 3, frequency: 4, customers: 56, gmv: 89000, orders: 940 },
        { stage: "Loyal", name: "Lost", value: 98, percentage: 8, recency: 1, frequency: 2, customers: 74, gmv: 125000, orders: 1240 },
    ],
    business: [
        { stage: "New", name: "Champions", value: 180, percentage: 18, recency: 5, frequency: 5, customers: 362, gmv: 40000, orders: 500 },
        { stage: "Early-life", name: "Loyal", value: 160, percentage: 14, recency: 4, frequency: 4, customers: 44, gmv: 58000, orders: 690 },
        { stage: "Mature", name: "At Risk", value: 120, percentage: 10, recency: 3, frequency: 3, customers: 23, gmv: 85000, orders: 910 },
        { stage: "Loyal", name: "Lost", value: 80, percentage: 6, recency: 1, frequency: 2, customers: 13, gmv: 120000, orders: 1200 },
    ],
    sub: [
        { stage: "New", name: "Champions", value: 150, percentage: 15, recency: 5, frequency: 5, customers: 213, gmv: 38000, orders: 470 },
        { stage: "Early-life", name: "Loyal", value: 140, percentage: 12, recency: 4, frequency: 4, customers: 123, gmv: 55000, orders: 670 },
        { stage: "Mature", name: "At Risk", value: 110, percentage: 9, recency: 3, frequency: 3, customers: 32, gmv: 80000, orders: 880 },
        { stage: "Loyal", name: "Lost", value: 70, percentage: 5, recency: 1, frequency: 2, customers: 5, gmv: 110000, orders: 1150 },
    ],
    none: []
};

export default function MicroSegmentation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { CONNECTION_EXPIRY_KEY } = useSegmentData();
    const connection = localStorage.getItem(CONNECTION_EXPIRY_KEY)
    const { selectedSegment, setSelectedSegment } = useMicroSegmentation();

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
            ) : (<div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Micro Segmentation</h1>
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

                <Select onValueChange={(value) => {
                    setSelectedSegment(segmentationData[value]);
                    if (value) {
                        toast({
                            title: "Analysis successfully",
                            description: `Synced data of ${String(value)} segmentation successfully`,
                            duration: 3000,
                        })
                    }
                }}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose segment" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                        <SelectItem value="market" className="hover:bg-background hover:rounded-md cursor-pointer">Market segmentation</SelectItem>
                        <SelectItem value="business" className="hover:bg-background hover:rounded-md cursor-pointer">Business segmentation</SelectItem>
                        <SelectItem value="sub" className="hover:bg-background hover:rounded-md cursor-pointer">Sub segmentation</SelectItem>
                    </SelectContent>
                </Select>

                {selectedSegment !== null ? (<Outlet />) : (<h1>Please select a segmentation to sync</h1>)}
            </div>)}
        </DashboardShell>
    );
}

