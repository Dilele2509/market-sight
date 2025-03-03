
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, PieChart, Users, Wallet } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Treemap, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const segmentationData = {
  market: [
    { name: "Champions", value: 234, percentage: 20, recency: 5, frequency: 5 },
    { name: "Loyal", value: 189, percentage: 15, recency: 4, frequency: 5 },
    { name: "At Risk", value: 142, percentage: 12, recency: 3, frequency: 4 },
    { name: "Lost", value: 98, percentage: 8, recency: 1, frequency: 2 },
  ],
  business: [
    { name: "Champions", value: 180, percentage: 18, recency: 5, frequency: 5 },
    { name: "Loyal", value: 160, percentage: 14, recency: 4, frequency: 4 },
    { name: "At Risk", value: 120, percentage: 10, recency: 3, frequency: 3 },
    { name: "Lost", value: 80, percentage: 6, recency: 1, frequency: 2 },
  ],
  sub: [
    { name: "Champions", value: 150, percentage: 15, recency: 5, frequency: 5 },
    { name: "Loyal", value: 140, percentage: 12, recency: 4, frequency: 4 },
    { name: "At Risk", value: 110, percentage: 9, recency: 3, frequency: 3 },
    { name: "Lost", value: 70, percentage: 5, recency: 1, frequency: 2 },
  ],
  none: []
};

// Hàm chuyển đổi dữ liệu từ segmentationData -> trendData
const generateTrendData = (segment) => {
  const data = segmentationData[segment] || [];
  return [
    { date: "Jan", champions: data[0]?.value * 0.8 || 0, loyal: data[1]?.value * 0.8 || 0, risk: data[2]?.value * 0.8 || 0 },
    { date: "Feb", champions: data[0]?.value * 0.85 || 0, loyal: data[1]?.value * 0.85 || 0, risk: data[2]?.value * 0.85 || 0 },
    { date: "Mar", champions: data[0]?.value * 0.9 || 0, loyal: data[1]?.value * 0.9 || 0, risk: data[2]?.value * 0.9 || 0 },
    { date: "Apr", champions: data[0]?.value || 0, loyal: data[1]?.value || 0, risk: data[2]?.value || 0 },
  ];
};

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

export default function MicroSegmentation() {
  const [selectedSegment, setSelectedSegment] = useState("none");
  const [rfmData, setRfmData] = useState(segmentationData.none);
  const [trendData, setTrendData] = useState(generateTrendData("none"));

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
                  fill="#006BFF"
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

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">RFM Analysis</h1>
        </div>
        <div className="flex items-center">
          <Select onValueChange={(value)=>{
            setSelectedSegment(value); 
            setTrendData(generateTrendData(value));
            setRfmData(segmentationData[value]);
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

        {selectedSegment !== 'none' ? (<>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {rfmData.map((segment) => (
              <>
                <MetricCard
                  key={segment.name}
                  title={segment.name}
                  value={segment.value.toString()}
                  subtitle={`${segment.percentage}% of customers`}
                  icon={<Users className="h-4 w-4" />}
                  trend={{ value: segment.percentage, isPositive: segment.percentage > 10 }}
                />
              </>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>RFM Segment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
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
        </>) : (
          <>
            <h1>Please choose segment to sync</h1>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
