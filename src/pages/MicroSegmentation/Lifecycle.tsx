import type { Metadata } from "next"
import { ArrowUpRight, Calendar, Download, Filter, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerLifecycleChart } from "@/components/blocks/customerLifecycle/customer-lifecycle-chart"
import { CustomerMetricsTable } from "@/components/blocks/customerLifecycle/customer-metrics-table"
import { DateRangePicker } from "@/components/blocks/customerLifecycle/date-range-picker"
import { LifecycleStageCard } from "@/components/blocks/customerLifecycle/lifecycle-stage-card"
import { MetricCard } from "@/components/blocks/customerLifecycle/metric-card"
import { SegmentDistributionChart } from "@/components/blocks/customerLifecycle/segment-distribution-chart"
import { useContext, useEffect, useState } from "react"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { error } from "console"

export const metadata: Metadata = {
  title: "Customer Lifecycle Analysis",
  description: "Analyze customer behavior across different lifecycle stages",
}

export default function CustomerLifecyclePage() {
  const { token } = useContext(AuthContext);
  const header = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const [newCustomerSegment, setNewCustomerSegment] = useState([]);
  const [earlyCustomerSegment, setEarlyCustomerSegment] = useState([]);
  const [matureCustomerSegment, setMatureCustomerSegment] = useState([]);
  const [loyalCustomerSegment, setLoyalCustomerSegment] = useState([]);

  const transformData = (data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value:
        key === 'customer_count'
          ? value
          : typeof value === 'number'
            ? Math.floor(value * 100) / 100 
            : value,
    }));
  };


  const fetchSegmentList = async () => {
    const segments = [
      { url: '/customer-lifecycle/new-customers', setter: setNewCustomerSegment },
      { url: '/customer-lifecycle/early-life-customers', setter: setEarlyCustomerSegment },
      { url: '/customer-lifecycle/mature-customers', setter: setMatureCustomerSegment },
      { url: '/customer-lifecycle/loyal-customers', setter: setLoyalCustomerSegment },
    ];

    try {
      await Promise.all(
        segments.map(async ({ url, setter }) => {
          try {
            const res = await axiosPrivate.get(url, header);
            if (res.status === 200) {
              const transformed = transformData(res.data.data);
              setter(transformed);
            }
          } catch (err) {
            toast.error(err.message);
          }
        })
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSegmentList()
  }, [])

  const excludedKeys = ['customer_count', 'orders', 'aov', 'arpu', 'orders_per_day'];

  const getCustomerCount = (segment: { name: string, value: any }[]) =>
    segment.find(item => item.name === 'customer_count')?.value || 0;

  const getMetricsWithoutKeys = (segment: { name: string, value: any }[], excluded: string[]) =>
    segment.filter(item => !excluded.includes(item.name));

  const getMetricsWithoutCount = (segment: { name: string, value: any }[]) =>
    segment.filter(item => item.name !== 'customer_count');

  const lifecycleStages = [
    {
      title: "New Customers",
      count: getCustomerCount(newCustomerSegment),
      metrics: getMetricsWithoutCount(newCustomerSegment),
      color: "new",
    },
    {
      title: "Early-life Customers",
      count: getCustomerCount(earlyCustomerSegment),
      metrics: getMetricsWithoutKeys(earlyCustomerSegment, excludedKeys),
      color: "early",
    },
    {
      title: "Mature Customers",
      count: getCustomerCount(matureCustomerSegment),
      metrics: getMetricsWithoutCount(matureCustomerSegment),
      color: "mature",
    },
    {
      title: "Loyal Customers",
      count: getCustomerCount(loyalCustomerSegment),
      metrics: getMetricsWithoutCount(loyalCustomerSegment),
      color: "loyal",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Lifecycle Analysis</h1>
            <p className="text-muted-foreground">
              Track customer behavior and metrics across different lifecycle stages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Customers"
            value="24,892"
            change="+12.3%"
            trend="up"
            description="vs. previous period"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="New Customers"
            value="1,642"
            change="+5.8%"
            trend="up"
            description="vs. previous period"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Average Order Value"
            value="$86.32"
            change="+2.1%"
            trend="up"
            description="vs. previous period"
            icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Monthly Active Users"
            value="18,453"
            change="-3.2%"
            trend="down"
            description="vs. previous period"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Customer Lifecycle Distribution</CardTitle>
                  <CardDescription>Distribution of customers across lifecycle stages</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <CustomerLifecycleChart className="aspect-[2/1]" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Segment Distribution</CardTitle>
                  <CardDescription>Percentage of customers in each lifecycle stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <SegmentDistributionChart className="aspect-square" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {lifecycleStages.map((stage, index) => (
                <LifecycleStageCard
                  key={index}
                  title={stage.title}
                  count={stage.count}
                  metrics={stage.metrics}
                  color={stage.color}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Detailed breakdown of customer segments and their behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerMetricsTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Metrics</CardTitle>
                <CardDescription>Key performance indicators across all lifecycle stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  Monthly metrics visualization will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Long-term trends in customer behavior and lifecycle progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  Trend analysis visualization will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
