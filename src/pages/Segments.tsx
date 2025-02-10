
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Repeat, Timer, Users } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const lifecycleData = [
  {
    stage: "New",
    customers: 450,
    gmv: 45000,
    orders: 520,
  },
  {
    stage: "Early-life",
    customers: 380,
    gmv: 62000,
    orders: 720,
  },
  {
    stage: "Mature",
    customers: 290,
    gmv: 89000,
    orders: 940,
  },
  {
    stage: "Loyal",
    customers: 180,
    gmv: 125000,
    orders: 1240,
  },
];

export default function Segments() {
  const isMobile = useIsMobile();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customer Lifecycle Analysis</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="New Customers"
            value="450"
            subtitle="First purchase within last 30 days"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Early-life"
            value="380"
            subtitle="2-3 purchases within first 90 days"
            icon={<Timer className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Mature"
            value="290"
            subtitle="Regular purchasing pattern (4+ purchases)"
            icon={<Repeat className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Loyal"
            value="180"
            subtitle="High engagement over 180+ days"
            icon={<Layers className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Stage Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ height: isMobile ? "300px" : "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={{
                    customers: { color: "#9b87f5" },
                    gmv: { color: "#1EAEDB" },
                    orders: { color: "#F97316" },
                  }}
                >
                  <BarChart
                    data={lifecycleData}
                    margin={isMobile ? { top: 5, right: 20, left: -20, bottom: 5 } : { top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9b87f5" />
                    <YAxis yAxisId="right" orientation="right" stroke="#1EAEDB" />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="customers"
                      fill="#9b87f5"
                      name="Customers"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="gmv"
                      fill="#1EAEDB"
                      name="GMV"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="orders"
                      fill="#F97316"
                      name="Orders"
                    />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifecycleData.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="min-w-[120px]">
                      <p className="font-medium">{stage.stage}</p>
                      <p className="text-sm text-muted-foreground">{stage.customers} customers</p>
                    </div>
                    <div className="flex-1 mx-4 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(stage.customers / 450) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[40px] text-right">
                      {Math.round((stage.customers / 450) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stage Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifecycleData.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <p className="font-medium">{stage.stage}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">GMV</p>
                        <p className="font-medium">${stage.gmv.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-medium">{stage.orders}</p>
                      </div>
                    </div>
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
