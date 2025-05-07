import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CLSList } from "@/types/lifecycleTypes"
import { useEffect } from "react"

interface CustomerMetricsTableProps {
    tableData: CLSList
}

export function CustomerMetricsTable({ tableData }: CustomerMetricsTableProps) {
    useEffect(() => {
        console.log(tableData);
    }, [])

    const stages = ['new', 'early', 'mature', 'loyal'];

    const calculateTotals = (data: Record<string, any>) => {
        const totals = {
            gmv: 0,
            orders: 0,
            unique_customers: 0,
            aov: 0,
            avg_bill_per_user: 0,
            arpu: 0,
            orders_per_day: 0,
            orders_per_day_per_store: 0,
        };

        let count = 0;

        for (const key in data) {
            const metrics = data[key].aggregated_metrics;
            totals.gmv += metrics.gmv || 0;
            totals.orders += metrics.orders || 0;
            totals.unique_customers += metrics.unique_customers || 0;
            totals.aov += metrics.aov || 0;
            totals.avg_bill_per_user += metrics.avg_bill_per_user || 0;
            totals.arpu += metrics.arpu || 0;
            totals.orders_per_day += metrics.orders_per_day || 0;
            totals.orders_per_day_per_store += metrics.orders_per_day_per_store || 0;
            count++;
        }

        // Tính trung bình cho các chỉ số trung bình
        totals.aov = totals.aov / count;
        totals.avg_bill_per_user = totals.avg_bill_per_user / count;
        totals.arpu = totals.arpu / count;
        totals.orders_per_day = totals.orders_per_day / count;
        totals.orders_per_day_per_store = totals.orders_per_day_per_store / count;

        return totals;
    };

    const totals = calculateTotals(tableData);

    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Lifecycle Stage</TableHead>
                        <TableHead>GMV</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Unique Customers</TableHead>
                        <TableHead>AOV</TableHead>
                        <TableHead>Avg Bill/User</TableHead>
                        <TableHead>ARPU</TableHead>
                        <TableHead>Orders/Day</TableHead>
                        <TableHead>Orders/Day/Store</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stages.map((stageKey) => {
                        const stageData = tableData[stageKey];
                        const metrics = stageData?.aggregated_metrics || {};

                        return (
                            <TableRow key={stageKey}>
                                <TableCell className="font-medium">{stageData?.name || '-'}</TableCell>
                                <TableCell>${metrics.gmv?.toLocaleString() || '0'}</TableCell>
                                <TableCell>{metrics.orders?.toLocaleString() || '0'}</TableCell>
                                <TableCell>{metrics.unique_customers?.toLocaleString() || '0'}</TableCell>
                                <TableCell>${metrics.aov?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell>${metrics.avg_bill_per_user?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell>${metrics.arpu?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell>{metrics.orders_per_day?.toFixed(1) || '0.0'}</TableCell>
                                <TableCell>{metrics.orders_per_day_per_store?.toFixed(1) || '0.0'}</TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="font-medium">${totals.gmv.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{totals.orders.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{totals.unique_customers.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${totals.aov.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${totals.avg_bill_per_user.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${totals.arpu.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">{totals.orders_per_day.toFixed(1)}</TableCell>
                        <TableCell className="font-medium">{totals.orders_per_day_per_store.toFixed(1)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
