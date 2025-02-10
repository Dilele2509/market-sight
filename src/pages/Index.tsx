
import { useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart,
  Store,
} from "lucide-react";

const mockData = {
  gmv: {
    value: "$1.2M",
    trend: { value: 12.5, isPositive: true },
  },
  orders: {
    value: "15.8K",
    trend: { value: 8.2, isPositive: true },
  },
  customers: {
    value: "5.2K",
    trend: { value: 4.1, isPositive: true },
  },
  aov: {
    value: "$76",
    trend: { value: 2.3, isPositive: false },
  },
  arpu: {
    value: "$230",
    trend: { value: 6.7, isPositive: true },
  },
  ordersPerStore: {
    value: "127",
    trend: { value: 3.4, isPositive: true },
  },
};

const Index = () => {
  useEffect(() => {
    document.title = "Dashboard | RetailSight";
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Your retail analytics at a glance
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="GMV"
            value={mockData.gmv.value}
            subtitle="Gross Merchandise Value"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={mockData.gmv.trend}
          />
          <MetricCard
            title="Orders"
            value={mockData.orders.value}
            subtitle="Total transactions"
            icon={<ShoppingCart className="h-4 w-4" />}
            trend={mockData.orders.trend}
          />
          <MetricCard
            title="Customers"
            value={mockData.customers.value}
            subtitle="Unique customers"
            icon={<Users className="h-4 w-4" />}
            trend={mockData.customers.trend}
          />
          <MetricCard
            title="AOV"
            value={mockData.aov.value}
            subtitle="Average Order Value"
            icon={<DollarSign className="h-4 w-4" />}
            trend={mockData.aov.trend}
          />
          <MetricCard
            title="ARPU"
            value={mockData.arpu.value}
            subtitle="Average Revenue Per User"
            icon={<BarChart className="h-4 w-4" />}
            trend={mockData.arpu.trend}
          />
          <MetricCard
            title="Orders/Store"
            value={mockData.ordersPerStore.value}
            subtitle="Daily orders per store"
            icon={<Store className="h-4 w-4" />}
            trend={mockData.ordersPerStore.trend}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

export default Index;
