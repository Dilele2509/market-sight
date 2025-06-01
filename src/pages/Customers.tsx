
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Customers() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customer Analysis</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                +180 from last month
              </p>
            </CardContent>
          </Card>
          {/* Placeholder for more metrics */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for customer table/list */}
            <p className="text-muted-foreground">Customer data will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
