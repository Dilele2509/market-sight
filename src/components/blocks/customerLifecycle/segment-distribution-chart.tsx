"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

import { cn } from "@/lib/utils"
import { CLSItem, CLSList } from "@/types/lifecycleTypes"

interface SegmentDistributionChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: CLSList;
}

const generateColor = {
    'New': "hsl(var(--chart-1))",
    'Early-life': "hsl(var(--chart-2))",
    "Mature": "hsl(var(--chart-3))",
    "Loyal": "hsl(var(--chart-4))"
}

export function SegmentDistributionChart({ data, className, ...props }: SegmentDistributionChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    //console.log(data);

    if (!data || Object.keys(data).length === 0) {
        return <div className={cn("w-full", className)} {...props}>No data available</div>
    }

    const chartData = Object.values(data).map(item => ({
        name: item.name.split(" ")[0],
        value: item.metrics.customer_count
    }));

    return (
        <div className={cn("w-full", className)} {...props}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={generateColor[entry.name]}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} customers`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
