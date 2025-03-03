
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, UserPlus, Handshake, ChartNoAxesCombined, CircleHelp, Trophy } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMicroSegmentation } from "@/context/MicroSegmentationContext";

const setIcon = (stage) => {
  switch (stage) {
    case "New":
      return <UserPlus className="h-4 w-4" />;
    case "Early-life":
      return <ChartNoAxesCombined className="h-4 w-4" />;
    case "Mature":
      return <Handshake className="h-4 w-4" />;
    case "Loyal":
      return <Trophy className="h-4 w-4" />;
    default:
      return <CircleHelp className="h-4 w-4" />;
  }
};

const setSubtitle = (stage) => {
  switch (stage) {
    case "New":
      return "First purchase within last 30 days";
    case "Early-life":
      return '2-3 purchases within first 90 days';
    case "Mature":
      return 'Regular purchasing pattern (4+ purchases)';
    case "Loyal":
      return 'High engagement over 180+ days';
    default:
      return "No subtitle";
  }
};

export default function Segments() {
  const isMobile = useIsMobile();
  const { selectedSegment } = useMicroSegmentation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Lifecycle Analysis</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {selectedSegment.map((segment) => (
          <MetricCard
            key={segment.stage}
            title={segment.stage}
            value={segment.customers}
            subtitle={setSubtitle(segment.stage)}
            icon={setIcon(segment.stage)}
            trend={{ value: Number((segment.customers * 0.1).toFixed(3)), isPositive: true }}
          />
        ))}
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
                  customers: { color: "#08C2FF" },
                  gmv: { color: "#FCC737" },
                  orders: { color: "#006BFF" },
                }}
              >
                <BarChart
                  data={selectedSegment}
                  margin={isMobile ? { top: 5, right: 20, left: -20, bottom: 5 } : { top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" orientation="left" stroke="#08C2FF" />
                  <YAxis yAxisId="right" orientation="right" stroke="#FCC737" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="customers"
                    fill="#08C2FF"
                    name="Customers"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="gmv"
                    fill="#FCC737"
                    name="GMV"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    fill="#006BFF"
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
              {selectedSegment.map((stage) => (
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
              {selectedSegment.map((stage) => (
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
    </div >
  );
}
