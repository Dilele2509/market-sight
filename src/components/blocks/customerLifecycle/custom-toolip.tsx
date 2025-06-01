import React from 'react';
import { TooltipProps } from 'recharts';

const chartConfig = {
    GMV: {
        label: "GMV",
        color: "hsl(var(--chart-1))",
    },
    Orders: {
        label: "Orders",
        color: "hsl(var(--chart-2))",
    },
    Customers: {
        label: "Customers",
        color: "hsl(var(--chart-3))",
    },
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="border-2 bg-background p-2 shadow-lg rounded">
                <p className="text-sm text-muted-foreground mb-2">{label}</p>
                {payload.map((entry, index) => {
                    const color = chartConfig[entry.name as keyof typeof chartConfig]?.color || '#000';
                    return (
                        <p key={`item-${index}`} className="text-sm">
                            <span style={{ color: color, fontWeight: 'normal' }}>{entry.name}</span>: {entry.value?.toLocaleString()} 
                        </p>
                    );
                })}
            </div>
        );
    }

    return null;
};

export default CustomTooltip;
