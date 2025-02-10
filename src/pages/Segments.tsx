
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

export default function Segments() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customer Segmentation</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Currently active customer segments
              </p>
            </CardContent>
          </Card>
          {/* Placeholder for more segment metrics */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Segment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for segments list/table */}
            <p className="text-muted-foreground">Segment data will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
