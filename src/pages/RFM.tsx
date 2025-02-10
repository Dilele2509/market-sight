
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Users, Wallet } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const rfmData = [
  { name: "Champions", value: 234, percentage: 20 },
  { name: "Loyal", value: 189, percentage: 15 },
  { name: "At Risk", value: 142, percentage: 12 },
  { name: "Lost", value: 98, percentage: 8 },
];

const trendData = [
  { date: "Jan", champions: 180, loyal: 165, risk: 130 },
  { date: "Feb", champions: 200, loyal: 170, risk: 135 },
  { date: "Mar", champions: 220, loyal: 180, risk: 140 },
  { date: "Apr", champions: 234, loyal: 189, risk: 142 },
];

export default function RFM() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">RFM Analysis</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Champions"
            value="234"
            subtitle="High value, high frequency customers"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Loyal Customers"
            value="189"
            subtitle="Regular high-value customers"
            icon={<Wallet className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="At Risk"
            value="142"
            subtitle="Previous champions showing decline"
            icon={<BarChart className="h-4 w-4" />}
            trend={{ value: 5, isPositive: false }}
          />
          <MetricCard
            title="Lost"
            value="98"
            subtitle="No recent activity"
            icon={<PieChart className="h-4 w-4" />}
            trend={{ value: 3, isPositive: false }}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>RFM Segment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    champions: { color: "#9b87f5" },
                    loyal: { color: "#1EAEDB" },
                    risk: { color: "#F97316" },
                  }}
                >
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="champions"
                      stackId="1"
                      stroke="#9b87f5"
                      fill="#9b87f5"
                    />
                    <Area
                      type="monotone"
                      dataKey="loyal"
                      stackId="1"
                      stroke="#1EAEDB"
                      fill="#1EAEDB"
                    />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stackId="1"
                      stroke="#F97316"
                      fill="#F97316"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfmData.map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{segment.name}</p>
                      <p className="text-sm text-muted-foreground">{segment.value} customers</p>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{segment.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
