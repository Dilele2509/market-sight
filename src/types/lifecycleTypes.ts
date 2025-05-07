export interface TimeWindow {
  reference_date: string;
  time_range: number;
  start_date: string;
  end_date: string;
}

export interface MetricsPeriod {
  start_date: string;
  end_date: string;
}

export interface MetricsValue {
  customer_count: number;
  gmv: number;
  orders: number;
  unique_customers: number;
  aov: number;
  avg_bill_per_user: number;
  arpu: number;
  orders_per_day: number;
  orders_per_day_per_store: number;
  repeat_purchase_rate: number;
  avg_time_between_purchases: number;
  avg_order_value: number;
}

export interface Metrics {
  period: MetricsPeriod;
  values: MetricsValue;
}

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  registration_date: string;
  address: string;
  city: string;
  purchase_count: number;
  first_purchase_date: string;
  last_purchase_date: string;
  days_between_purchases: number;
  avg_purchase_amount: number;
  total_spent: number;
  categories_purchased: number;
  purchase_categories: string;
  brands_purchased: number;
  brand_names: string;
  stores_visited: number;
  store_names: string;
  payment_methods: string;
  days_since_first_purchase: number;
  days_since_last_purchase: number;
}

export interface AggregatedMetrics {
  gmv: number;
  orders: number;
  unique_customers: number;
  aov: number;
  avg_bill_per_user: number;
  arpu: number;
  orders_per_day: number;
  orders_per_day_per_store: number;
  repeat_purchase_rate: number;
  avg_time_between_purchases: number;
  avg_order_value: number;
  purchase_frequency: number;
  avg_basket_size: number;
  monthly_spend: number;
  annual_customer_value: number;
  category_penetration: number;
}

export interface CLSItem {
  name: string;
  metrics: Metrics[];
  customers: Customer[];
  aggregated_metrics: AggregatedMetrics;
  time_window: TimeWindow;
}

export interface CLSList {
  new?: CLSItem;
  early?: CLSItem;
  mature?: CLSItem;
  loyal?: CLSItem;
}


export interface BreakdownMonthly {
  period: {
    start_date: string;
    end_date: string;
  };
  stages: {
    New: StageDetail<"new">;
    "Early-life": StageDetail<"early">;
    Mature: StageDetail<"mature">;
    Loyal: StageDetail<"loyal">;
  };
}

type StageDetail<T extends "new" | "early" | "mature" | "loyal"> = {
  customer_count: number;
  metrics: T extends "new"
  ? NewMetrics
  : T extends "early"
  ? EarlyLifeMetrics
  : T extends "mature"
  ? MatureMetrics
  : LoyalMetrics;
};

interface NewMetrics {
  first_purchase_gmv: number;
  avg_first_purchase_value: number;
  conversion_to_second_purchase_rate: number;
}

interface EarlyLifeMetrics {
  aov: number;
  arpu: number;
  avg_order_value: number;
  orders_per_customer: number;
  repeat_purchase_rate: number;
  avg_time_between_purchases: number;
}

interface MatureMetrics {
  monthly_spend: number;
  avg_basket_size: number;
  purchase_frequency: number;
}

interface LoyalMetrics {
  purchase_frequency: number;
  category_penetration: number;
  annual_customer_value: number;
}
