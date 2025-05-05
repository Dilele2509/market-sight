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
import { CLSList, MetricsValue } from "@/types/lifecycleTypes"
import { useLifeContext } from "@/context/LifecycleContext"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import MetricsLineGraph from "@/components/blocks/customerLifecycle/line-graph-component"
import LifecycleGMVCard from "./LifecycleGMVCard"

export const metadata: Metadata = {
  title: "Customer Lifecycle Analysis",
  description: "Analyze customer behavior across different lifecycle stages",
}

export default function CustomerLifecyclePage() {
  const sortOrder = ["new", "early", "mature", "loyal"];
  const { date, timeRange } = useLifeContext();
  const { token } = useContext(AuthContext);
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const [cusLifeList, setCusLifeList] = useState<CLSList>({});
  const [dataMonthly, setDataMonthly] = useState<Object[]>([]);
  const [dataGMV, setDataGMV] = useState<Object[]>([]);

  useEffect(() => {
    console.log(cusLifeList)
  }, [cusLifeList])

  const monthMap = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  const formatCustomerData = (inputData: Object): any => {
    const result = Object.entries(inputData).map(([title, values]) => {
      //console.log('check title: ', title, ' check value: ', values);
      const startDateRaw = values?.period?.start_date || "";
      const startDate = new Date(startDateRaw);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      const isValidDate = !isNaN(startDate.getTime());

      return {
        month: isValidDate ? `${monthMap[month]} ${year}` : "Invalid Date",
        new: values?.stages["New Customers"].customer_count || 0,
        early: values?.stages["Early Life Customers"].customer_count || 0,
        mature: values?.stages["Mature Customers"].customer_count || 0,
        loyal: values?.stages["Loyal Customers"].customer_count || 0,
      };
    });
  }
  const formatGMVData = (inputData: Object) => {
    const result = Object.entries(inputData).map(([title, values]) => {
      const startDateRaw = values?.period?.start_date || "";
      const startDate = new Date(startDateRaw);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      const isValidDate = !isNaN(startDate.getTime());

      return {
        month: isValidDate ? `${monthMap[month]} ${year}` : "Invalid Date",
        GMV: values?.values?.["gmv"] || 0,
        Orders: values?.values?.["orders"] || 0,
        Customers: values?.values?.["customer_count"] || 0,
      };
    });

    return result;
  };

  useEffect(() => {
    console.log(dataMonthly);
  }, [dataMonthly])

  useEffect(()=>{
    console.log('gmv: ', dataGMV);
  },[dataGMV])

  const fetchLineGraphTotalData = async () => {
    try {
      await axiosPrivate.post('/customer-lifecycle/stage-breakdown',
        { reference_date: format(date, "yyyy-MM-dd"), time_range: timeRange },
        header
      )
        .then((res) => {
          if (res.status === 200) {
            const formatData = formatCustomerData(res.data.data.monthly_breakdown)
            //console.log(formatData);
            setDataMonthly(formatData)
          }
        })
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchSegmentList = async () => {
    // console.log(format(date, "yyyy-MM-dd"), timeRange)
    const segments = [
      { key: 'new', url: '/customer-lifecycle/new-customers' },
      { key: 'early', url: '/customer-lifecycle/early-life-customers' },
      { key: 'mature', url: '/customer-lifecycle/mature-customers' },
      { key: 'loyal', url: '/customer-lifecycle/loyal-customers' },
    ];

    try {
      await Promise.all(
        segments.map(async ({ key, url }) => {
          try {
            const res = await axiosPrivate.post(
              url,
              { reference_date: format(date, "yyyy-MM-dd"), time_range: timeRange },
              header
            );

            if (res.status === 200) {
              const data = res.data.data;
              setDataGMV((prev) => ({
                ...prev,
                [key]: formatGMVData(data.metrics)
              }));

              setCusLifeList((prev) => ({
                ...prev,
                [key]: {
                  name: data.segment,
                  metrics: data.metrics,
                  customers: data.customers,
                  time_window: data.time_window,
                },
              }));
            }
          } catch (err) {
            toast.error('no data at this time');
          }
        })
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSegmentList();
    fetchLineGraphTotalData();
  }, [date, timeRange]);

  const excludedKeysEarly = ['customer_count', 'orders', 'aov', 'arpu', 'orders_per_day', 'customer_percentage'];
  const excludedKeys = ['customer_count', 'customer_percentage'];

  const getMetricsWithoutKeys = (metricValueList: Record<string, MetricsValue>, excluded: string[]) => {
    return Object.entries(metricValueList)
      .filter(([key]) => !excluded.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, MetricsValue>);
  };

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
            <DateRangePicker className="bg-background" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="bg-primary" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Click to sync data
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* for chart overview  */}
        <LifecycleGMVCard GMVData={dataGMV}/>

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
                  <CustomerLifecycleChart data={dataMonthly} className="aspect-[2/1]" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Segment Distribution</CardTitle>
                  <CardDescription>Percentage of customers in each lifecycle stage</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(cusLifeList).length > 0 &&
                    <SegmentDistributionChart data={cusLifeList} className="aspect-square" />
                  }
                </CardContent>
              </Card>
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {cusLifeList && Object.entries(cusLifeList)
                .sort(([keyA], [keyB]) => {
                  return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
                })
                .map(([key, value], index) => {
                  const lastMetric = value?.metrics?.[value.metrics.length - 1];
                  //console.log(key, ' name: ', value?.name, ' last metric: ', lastMetric.values);

                  return (
                    <></>
                    // <LifecycleStageCard
                    //   key={index}
                    //   title={value.name}
                    //   count={value.metrics.customer_count}
                    //   metrics={getMetricsWithoutKeys(lastMetric?.values, key === 'early' ? excludedKeysEarly : excludedKeys)}
                    //   color={key}
                    // />
                  )
                }
                )}
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
