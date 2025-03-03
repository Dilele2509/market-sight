
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Repeat, Timer, Users } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const segmentationData = {
  market: [
    { stage: "New", subtitle: 'First purchase within last 30 days', customers: 234, gmv: 45000, orders: 520 },
    { stage: "Early-life", subtitle: '2-3 purchases within first 90 days', customers: 189, gmv: 62000, orders: 720 },
    { stage: "Mature", subtitle: 'Regular purchasing pattern (4+ purchases)', customers: 142, gmv: 89000, orders: 940 },
    { stage: "Loyal", subtitle: 'High engagement over 180+ days', customers: 98, gmv: 125000, orders: 1240 },
  ],
  business: [
    { stage: "New", subtitle: 'First purchase within last 30 days', customers: 180, gmv: 40000, orders: 500 },
    { stage: "Early-life", subtitle: '2-3 purchases within first 90 days', customers: 160, gmv: 58000, orders: 690 },
    { stage: "Mature", subtitle: 'Regular purchasing pattern (4+ purchases)', customers: 120, gmv: 85000, orders: 910 },
    { stage: "Loyal", subtitle: 'High engagement over 180+ days', customers: 80, gmv: 120000, orders: 1200 },
  ],
  sub: [
    { stage: "New", subtitle: 'First purchase within last 30 days', customers: 150, gmv: 38000, orders: 470 },
    { stage: "Early-life", subtitle: '2-3 purchases within first 90 days', customers: 140, gmv: 55000, orders: 670 },
    { stage: "Mature", subtitle: 'Regular purchasing pattern (4+ purchases)', customers: 110, gmv: 80000, orders: 880 },
    { stage: "Loyal", subtitle: 'High engagement over 180+ days', customers: 70, gmv: 110000, orders: 1150 },
  ],
  none: []
};


export default function Segments() {
  const isMobile = useIsMobile();
  const [selectedSegment, setSelectedSegment] = useState("none");
  const [lifecycleData, setLifecycleData] = useState(segmentationData.none);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Lifecycle Analysis</h1>
      </div>
      <div className="flex items-center">
        <Select onValueChange={(value) => {
          setSelectedSegment(value);
          setLifecycleData(segmentationData[value]);
          if (value) {
            toast({
              title: "Analysis successfully",
              description: `Synced data of ${selectedSegment} segmentation successfully`,
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
        {/* <Button
            type="submit"
            className="ml-3 h-9"
            onClick={handleAnalysis}>Analysis</Button> */}
      </div>
      {selectedSegment !== 'none' ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {lifecycleData.map((segment) => (
              <MetricCard
                key={segment.stage}
                title={segment.stage}
                value={segment.customers}
                subtitle={segment.subtitle}
                icon={<Layers className="h-4 w-4" />}
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
                      data={lifecycleData}
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
        </>) : (
        <>
          <h1>Please choose segment to sync</h1>
        </>
      )}
    </div >
  );
}
