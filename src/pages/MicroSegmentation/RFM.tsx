
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Treemap, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Trophy, User, TriangleAlert, Ban, CircleHelp } from "lucide-react";
import { useMicroSegmentation } from "@/context/MicroSegmentationContext";

// Hàm chuyển đổi dữ liệu từ segmentationData -> trendData
const generateTrendData = (segment : object) => {
  const data = segment
  return [
    { date: "Jan", champions: data[0]?.value * 0.8 || 0, loyal: data[1]?.value * 0.8 || 0, risk: data[2]?.value * 0.8 || 0 },
    { date: "Feb", champions: data[0]?.value * 0.85 || 0, loyal: data[1]?.value * 0.85 || 0, risk: data[2]?.value * 0.85 || 0 },
    { date: "Mar", champions: data[0]?.value * 0.9 || 0, loyal: data[1]?.value * 0.9 || 0, risk: data[2]?.value * 0.9 || 0 },
    { date: "Apr", champions: data[0]?.value || 0, loyal: data[1]?.value || 0, risk: data[2]?.value || 0 },
  ];
};

const setIcon = (name: string) => {
  switch (name) {
    case "Champions":
      return <Trophy className="h-4 w-4" />;
    case "Loyal":
      return <User className="h-4 w-4" />;
    case "At Risk":
      return <TriangleAlert className="h-4 w-4" />;
    case "Lost":
      return <Ban className="h-4 w-4" />;
    default:
      return <CircleHelp className="h-4 w-4" />;
  }
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

export default function RFM() {
  const { selectedSegment } = useMicroSegmentation()
  const [trendData, setTrendData] = useState(generateTrendData(selectedSegment));

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
                  data={selectedSegment}
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">RFM Analysis</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {selectedSegment.map((segment) => (
          <>
            <MetricCard
              key={segment.name}
              title={segment.name}
              value={segment.value.toString()}
              subtitle={`${segment.percentage}% of customers`}
              icon={setIcon(segment.name)}
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
              {selectedSegment.map((segment) => (
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
  );
}
