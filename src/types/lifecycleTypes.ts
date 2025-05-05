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
  
  export interface CLSItem {
    name: string; 
    metrics: Metrics[];
    customers: Customer[];
    time_window: TimeWindow;
  }
  
  export interface CLSList {
    new?: CLSItem;
    early?: CLSItem;
    mature?: CLSItem;
    loyal?: CLSItem;
  }
  