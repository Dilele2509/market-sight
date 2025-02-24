
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Users, Wallet } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Treemap, Tooltip, XAxis, YAxis } from "recharts";

const rfmData = [
  { name: "Champions", value: 234, percentage: 20, recency: 5, frequency: 5 },
  { name: "Loyal", value: 189, percentage: 15, recency: 4, frequency: 5 },
  { name: "At Risk", value: 142, percentage: 12, recency: 3, frequency: 4 },
  { name: "Lost", value: 98, percentage: 8, recency: 1, frequency: 2 },
];

const trendData = [
  { date: "Jan", champions: 180, loyal: 165, risk: 130 },
  { date: "Feb", champions: 200, loyal: 170, risk: 135 },
  { date: "Mar", champions: 220, loyal: 180, risk: 140 },
  { date: "Apr", champions: 234, loyal: 189, risk: 142 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-yellow-600 p-2 rounded shadow text-sm">
        <p className="font-medium">{data.name}</p>
        <p>Customers: {data.value}</p>
        <p>Percentage: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const TreemapRFM = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFM TreeMap</CardTitle>
      </CardHeader>
      <CardContent className="pb-10 h-96 relative flex flex-col">
        <div className="flex flex-1 w-full">
          {/* Hiển thị trục Frequency/Monetary */}
          <div className="flex relative ml-8 mr-8">
            <div className="flex flex-col justify-between h-full text-xs">
              {[5, 4, 3, 2, 1].map((f) => (
                <div key={f} className="flex-1 flex items-center">{f}</div>
              ))}
            </div>
            <div className="absolute -left-24 top-1/3 transform -translate-y-1/2 h-10 w-40 -rotate-90 text-xs font-semibold">
              Frequency / Monetary
            </div>
          </div>

          {/* Biểu đồ Treemap */}
          <div className="flex-1 flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={rfmData}
                dataKey="value"
                nameKey="name"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#3182bd"
              >
                <Tooltip content={CustomTooltip} />/
              </Treemap>
            </ResponsiveContainer>

            {/* Hiển thị trục Recency */}
            <div className="relative mt-2 flex justify-between text-xs">
              {[1, 2, 3, 4, 5].map((r) => (
                <div key={r} className="flex-1 text-center">{r}</div>
              ))}
            </div>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
              Recency
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


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
                    champions: { color: "#08C2FF" },
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
                      stroke="#08C2FF"
                      fill="#08C2FF"
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

        <div className="grid gap-4 md:grid-cols-2">
          <TreemapRFM />
        </div>
      </div>
    </DashboardShell>
  );
}
