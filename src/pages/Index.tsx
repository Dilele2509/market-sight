"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { AreaChartCard, BarChartCard, PieChartCard } from "@/components/dashboard/ChartDashboard"
import { DashboardShell } from "@/components/layout/DashboardShell"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"

export default function Dashboard() {
  const [period, setPeriod] = useState("current")

  // Dashboard data
  const dashboardData = {
    period: {
      start_date: "2025-03-01",
      end_date: "2025-03-31",
    },
    values: {
      gmv: 14669.54,
      orders: 30,
      unique_customers: 14,
      aov: 488.98466666666667,
      avg_bill_per_user: 1047.8242857142857,
      arpu: 293.3908,
      orders_per_day: 0.967741935483871,
      orders_per_day_per_store: 0.1935483870967742,
    },
    changes: {
      gmv: -39.41,
      orders: 66.67,
      unique_customers: 16.67,
      aov: -63.64,
      avg_bill_per_user: -48.06,
      arpu: -39.41,
      orders_per_day: 50.54,
      orders_per_day_per_store: 50.54,
    },
  }

  // Chart data for GMV trend
  const gmvTrendData = [
    { name: "Mar 1", value: 300 },
    { name: "Mar 5", value: 600 },
    { name: "Mar 10", value: 400 },
    { name: "Mar 15", value: 800 },
    { name: "Mar 20", value: 500 },
    { name: "Mar 25", value: 700 },
    { name: "Mar 31", value: 900 },
  ]

  // Chart data for Orders vs Customers
  const ordersVsCustomersData = [
    { name: "Week 1", orders: 8, customers: 4 },
    { name: "Week 2", orders: 7, customers: 3 },
    { name: "Week 3", orders: 9, customers: 5 },
    { name: "Week 4", orders: 6, customers: 2 },
  ]

  // Chart data for AOV distribution
  const aovDistributionData = [
    { name: "<$200", value: 5 },
    { name: "$200-$400", value: 8 },
    { name: "$400-$600", value: 10 },
    { name: "$600-$800", value: 4 },
    { name: ">$800", value: 3 },
  ]

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
          <div className="flex items-center gap-2">
            {/* <ShoppingBagIcon className="h-6 w-6" /> */}
            <h1 className="text-lg font-semibold">E-Commerce Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* GMV Card */}
            <MetricCard
              title="Gross Merchandise Value"
              value={dashboardData.values.gmv}
              change={dashboardData.changes.gmv}
              icon={<DollarSignIcon />}
              isCurrency={true}
            />

            {/* Orders Card */}
            <MetricCard
              title="Total Orders"
              value={dashboardData.values.orders}
              change={dashboardData.changes.orders}
              icon={<ShoppingCartIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* Unique Customers Card */}
            <MetricCard
              title="Unique Customers"
              value={dashboardData.values.unique_customers}
              change={dashboardData.changes.unique_customers}
              icon={<UsersIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* AOV Card */}
            <MetricCard
              title="Average Order Value"
              value={dashboardData.values.aov}
              change={dashboardData.changes.aov}
              icon={<CreditCardIcon />}
              isCurrency={true}
            />
          </div>

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>

              <TabsContent value="overview" className="space-y-4">
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
                <AreaChartCard
                  title="GMV Trend"
                  description="Daily gross merchandise value for March 2025"
                  data={gmvTrendData}
                  dataKey="value"
                  xAxisDataKey="name"
                  height={300}
                  valueFormatter={(value) => `$${value}`}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Orders vs Customers Chart */}
                  <BarChartCard
                    title="Orders vs Customers"
                    description="Weekly comparison for March 2025"
                    data={ordersVsCustomersData}
                    barKeys={["orders", "customers"]}
                    xAxisDataKey="name"
                    height={300}
                  />

                  {/* AOV Distribution Chart */}
                  <PieChartCard
                    title="AOV Distribution"
                    description="Order value distribution for March 2025"
                    data={aovDistributionData}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                    valueFormatter={(value) => `${value} orders`}
                  />
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Orders Analysis</CardTitle>
                    <CardDescription>Detailed order metrics for March 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Select the Orders tab to view detailed order analysis.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Analysis</CardTitle>
                    <CardDescription>Detailed customer metrics for March 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Select the Customers tab to view detailed customer analysis.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>Key takeaways from March 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1.5 dark:bg-emerald-900">
                      <TrendingUpIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Orders increased by 66.67%</p>
                      <p className="text-xs text-muted-foreground">Strong growth in order volume</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-rose-100 p-1.5 dark:bg-rose-900">
                      <TrendingDownIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AOV decreased by 63.64%</p>
                      <p className="text-xs text-muted-foreground">Significant drop in average order value</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1.5 dark:bg-emerald-900">
                      <UsersIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Customer base grew by 16.67%</p>
                      <p className="text-xs text-muted-foreground">Healthy growth in unique customers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-rose-100 p-1.5 dark:bg-rose-900">
                      <DollarSignIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GMV decreased by 39.41%</p>
                      <p className="text-xs text-muted-foreground">Overall revenue decline despite more orders</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </DashboardShell>
  )
}
