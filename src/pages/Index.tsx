"use client"

import { useContext, useEffect, useState } from "react"
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, getYear } from "date-fns"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { LineChartCard, BarChartCard, PieChartCard } from "@/components/dashboard/ChartDashboard"
import { DashboardShell } from "@/components/layout/DashboardShell"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"
import { axiosPrivate } from "@/API/axios"
import { useLifeContext } from "@/context/LifecycleContext"
import AuthContext from "@/context/AuthContext"
import { QuickInsightsCard } from "@/components/dashboard/QuickInsightCard"
import { MonthlyDetailDropdown } from "@/components/dashboard/DropdownSelect"

export interface dashboardDataInterface {
  period: {
    start_date: string,
    end_date: string,
  },
  values: {
    gmv: number,
    orders: number,
    unique_customers: number,
    aov: number,
    avg_bill_per_user: number,
    arpu: number,
    orders_per_day: number,
    orders_per_day_per_store: number,
  },
  changes: {
    gmv: number,
    orders: number,
    unique_customers: number,
    aov: number,
    avg_bill_per_user: number,
    arpu: number,
    orders_per_day: number,
    orders_per_day_per_store: number,
  },
}

export interface rawDataInterface {
  success: boolean,
  data: {
    "metrics": dashboardDataInterface[],
    "is_monthly_breakdown": boolean,
    "time_window": {
      "start_date": string,
      "end_date": string
    }
  }
}

export default function Dashboard() {
  const { startDate, endDate } = useLifeContext();
  const { token } = useContext(AuthContext)
  const [rawData, setRawData] = useState<rawDataInterface>()
  const [dashboardData, setDashboardData] = useState<dashboardDataInterface>()

  // The 8 specific metrics to display
  const metricsToShow = [
    "gmv",
    "orders",
    "unique_customers",
    "aov",
    "avg_bill_per_user",
    "arpu",
    "orders_per_day",
    "orders_per_day_per_store",
  ]

  // Metrics with smaller values that should use the right y-axis
  const smallValueMetrics = ["orders", "unique_customers", "orders_per_day", "orders_per_day_per_store"]

  const fetchDataDashboard = async () => {
    try {
      const res = await axiosPrivate.post('/customer-lifecycle/topline-metrics',
        { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log('check: ', res.data);
      setRawData(res.data);
      if (res.data?.data?.is_monthly_breakdown && Array.isArray(res.data?.data?.metrics)) {
        const metrics = res.data?.data?.metrics
        const lastElement = metrics[metrics.length - 1]
        //console.log('last: ', lastElement)
        setDashboardData(lastElement)
      } else if (!res.data?.data?.is_monthly_breakdown && Array.isArray(res.data?.data?.metrics)) {
        const metrics = res.data?.data?.metrics
        setDashboardData(metrics[0])
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

  useEffect(() => {
    // console.log("startDate:", startDate);
    // console.log("endDate:", endDate);
    fetchDataDashboard()
  }, [startDate, endDate])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <DashboardShell>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-background px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tổng quan hoạt động</h1>
          </div>
        </header>
        <div className="w-full flex items-center justify-end pr-6"><DateRangePicker /></div>

        <main className="flex-1 p-4 md:p-6">
          {dashboardData ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* GMV Card */}
            <MetricCard
              title="Gross Merchandise Value"
              value={dashboardData?.values?.gmv}
              change={dashboardData?.changes?.gmv}
              icon={<DollarSignIcon />}
              isCurrency={true}
            />

            {/* Orders Card */}
            <MetricCard
              title="Total Orders"
              value={dashboardData?.values?.orders}
              change={dashboardData?.changes?.orders}
              icon={<ShoppingCartIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* Unique Customers Card */}
            <MetricCard
              title="Unique Customers"
              value={dashboardData?.values?.unique_customers}
              change={dashboardData?.changes?.unique_customers}
              icon={<UsersIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* AOV Card */}
            <MetricCard
              title="Average Order Value"
              value={dashboardData?.values?.aov}
              change={dashboardData?.changes?.aov}
              icon={<CreditCardIcon />}
              isCurrency={true}
            />
          </div> : (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>)}

          <div className="mt-6">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <label className="font-bold">Tổng quan</label>
                <div className="flex items-center gap-4">
                  {rawData && <MonthlyDetailDropdown
                    data={rawData?.data?.metrics}
                    currentData={dashboardData}
                    resetCurrentData={setDashboardData} />}
                  <label className="font-medium text-sm flex items-center gap-1">Từ ngày: <p className="text-red-600 mr-2">{dashboardData?.period?.start_date}</p> đến ngày: <p className="text-red-600">{dashboardData?.period?.end_date}</p></label>
                </div>
              </div>

              {dashboardData ? <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Avg Bill Per User Card */}
                  <MetricCard
                    title="Avg Bill Per User"
                    value={dashboardData.values.avg_bill_per_user}
                    change={dashboardData.changes.avg_bill_per_user}
                    icon={<TrendingDownIcon />}
                    isCurrency={true}
                  />

                  {/* ARPU Card */}
                  <MetricCard
                    title="Average Revenue Per User"
                    value={dashboardData.values.arpu}
                    change={dashboardData.changes.arpu}
                    icon={<TrendingUpIcon />}
                    isCurrency={true}
                  />

                  {/* Orders Per Day Card */}
                  <MetricCard
                    title="Orders Per Day"
                    value={dashboardData.values.orders_per_day}
                    change={dashboardData.changes.orders_per_day}
                    icon={<ShoppingCartIcon />}
                    isCurrency={false}
                  />
                </div>

                {/* GMV Trend Chart */}
                <LineChartCard
                  title="Business Performance Metrics"
                  description="Monthly comparison of all key business metrics"
                  data={rawData?.data?.metrics}
                  dataKeys={metricsToShow}
                  smallValueKeys={smallValueMetrics}
                  xAxisDataKey="month"
                  height={500}
                  valueFormatter={(value) =>
                    typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Orders vs Customers Chart */}
                  <BarChartCard
                    title="Orders vs Customers"
                    description="Monthly comparison for the period"
                    data={rawData?.data?.metrics}
                    barKeys={["orders", "unique_customers"]}
                    xAxisDataKey="name"
                    height={300}
                  />

                  {/* AOV Distribution Chart */}
                  <PieChartCard
                    title="AOV Distribution"
                    description={`Order value distribution for period`}
                    data={rawData?.data?.metrics}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                    valueFormatter={(value) => `${value} orders`}
                  />
                </div>
              </div> : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
                  <p className="text-sm text-muted-foreground">Loading data...</p>
                </div>)}
            </div>
          </div>

          {dashboardData ? <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key metrics comparison with previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* GMV Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GMV</p>
                      <p className="text-xs text-muted-foreground">Gross Merchandise Value</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatCurrency(dashboardData.values.gmv)}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.gmv >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.gmv > 0 ? "+" : ""}
                        {dashboardData.changes.gmv.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Orders Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Orders</p>
                      <p className="text-xs text-muted-foreground">Total number of orders</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData.values.orders}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.orders >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.orders > 0 ? "+" : ""}
                        {dashboardData.changes.orders.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Customers Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Customers</p>
                      <p className="text-xs text-muted-foreground">Unique customers</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData.values.unique_customers}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.unique_customers >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.unique_customers > 0 ? "+" : ""}
                        {dashboardData.changes.unique_customers.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* AOV Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AOV</p>
                      <p className="text-xs text-muted-foreground">Average Order Value</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatCurrency(dashboardData.values.aov)}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.aov >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.aov > 0 ? "+" : ""}
                        {dashboardData.changes.aov.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QuickInsightsCard data={dashboardData} />
          </div> : (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>)}
        </main>
      </div>
    </DashboardShell>
  )
}
