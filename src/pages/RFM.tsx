
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export default function RFM() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">RFM Analysis</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Champions</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">
                High value, high frequency customers
              </p>
            </CardContent>
          </Card>
          {/* Placeholder for more RFM segments */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>RFM Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for RFM visualization */}
            <p className="text-muted-foreground">RFM analysis visualization will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
