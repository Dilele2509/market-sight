export interface TimeWindow {
    reference_date: string;
    time_range: number;
    start_date: string;
    end_date: string;
}

export interface Metrics {
    customer_count: number;
    customer_percentage?: number;
    repeat_purchase_rate?: number;
    avg_time_between_purchases?: number;
    avg_order_value?: number;
    orders?: number;
    annual_customer_value?: number;
    purchase_frequency?: number;
    category_penetration?: number;
    avg_basket_size?: number;
    monthly_spend?: number;
    first_purchase_gmv?: number;
    avg_first_purchase_value?: number;
    conversion_to_second_purchase_rate?: number;
}

export interface Customer {
    [key: string]: any;
}

export interface CLSItem {
    name: string;
    metrics: Metrics;
    customers: Customer[];
    time_window: TimeWindow;
}

export interface CLSList {
    new?: CLSItem;
    early?: CLSItem;
    mature?: CLSItem;
    loyal?: CLSItem;
}