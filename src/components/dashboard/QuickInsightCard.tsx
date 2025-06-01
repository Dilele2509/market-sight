import { TrendingUpIcon, TrendingDownIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
import { dashboardDataInterface } from '@/pages/Index';

interface QuickInsightsCardProps {
    data: dashboardDataInterface;
}

export function QuickInsightsCard({ data }: QuickInsightsCardProps) {
    const formatPercentageChange = (change: number) => `${change.toFixed(2)}%`;
    const formatIncreaseOrDecrease = (change: number) => (change > 0 ? 'Tăng' : 'Giảm');

    const getChangeIconAndBg = (change: number, Icon: React.ElementType) => {
        return {
            icon: change > 0 ? <TrendingUpIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <TrendingDownIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
            bgClass: change > 0 ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-rose-100 dark:bg-rose-900',
        };
    };

    const getEvaluationMessage = (change: number, metric: string) => {
        const absChange = Math.abs(change);
        const isPositive = change > 0;
        const prefix = isPositive ? 'Tăng' : 'Giảm';
        
        let intensity = '';
        if (absChange < 5) {
            intensity = 'nhẹ';
        } else if (absChange < 15) {
            intensity = 'trung bình';
        } else if (absChange < 30) {
            intensity = 'khá mạnh';
        } else {
            intensity = 'mạnh';
        }

        switch (metric) {
            case 'orders':
                return `${prefix} ${intensity} trong số lượng đơn hàng`;
            case 'aov':
                return `${prefix} ${intensity} trong giá trị đơn hàng trung bình`;
            case 'unique_customers':
                return `${prefix} ${intensity} trong số lượng khách hàng mới`;
            case 'gmv':
                return `${prefix} ${intensity} trong tổng doanh thu`;
            default:
                return '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Phân tích nhanh</CardTitle>
                <CardDescription>Những điểm chính từ {new Date(data.period.start_date).toLocaleString('en-us', { month: 'long', year: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Orders */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.orders, TrendingUpIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.orders, TrendingUpIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`Đơn hàng ${formatIncreaseOrDecrease(data.changes.orders)} ${formatPercentageChange(data.changes.orders)}`}</p>
                            <p className="text-xs text-muted-foreground">{getEvaluationMessage(data.changes.orders, 'orders')}</p>
                        </div>
                    </div>

                    {/* AOV */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.aov, TrendingUpIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.aov, TrendingUpIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`AOV ${formatIncreaseOrDecrease(data.changes.aov)} ${formatPercentageChange(data.changes.aov)}`}</p>
                            <p className="text-xs text-muted-foreground">{getEvaluationMessage(data.changes.aov, 'aov')}</p>
                        </div>
                    </div>

                    {/* Unique Customers */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.unique_customers, UsersIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.unique_customers, UsersIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`Khách hàng ${formatIncreaseOrDecrease(data.changes.unique_customers)} ${formatPercentageChange(data.changes.unique_customers)}`}</p>
                            <p className="text-xs text-muted-foreground">{getEvaluationMessage(data.changes.unique_customers, 'unique_customers')}</p>
                        </div>
                    </div>

                    {/* GMV */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.gmv, DollarSignIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.gmv, DollarSignIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`GMV ${formatIncreaseOrDecrease(data.changes.gmv)} ${formatPercentageChange(data.changes.gmv)}`}</p>
                            <p className="text-xs text-muted-foreground">{getEvaluationMessage(data.changes.gmv, 'gmv')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
