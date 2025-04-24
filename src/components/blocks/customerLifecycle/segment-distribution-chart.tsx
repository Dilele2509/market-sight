"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

interface SegmentDistributionChartProps extends React.HTMLAttributes<HTMLDivElement> { }

const data = [
    { name: "New", value: 6.6, color: "hsl(var(--chart-1))" },
    { name: "Early-life", value: 21.0, color: "hsl(var(--chart-2))" },
    { name: "Mature", value: 50.1, color: "hsl(var(--chart-3))" },
    { name: "Loyal", value: 22.3, color: "hsl(var(--chart-4))"},
]

export function SegmentDistributionChart({ className, ...props }: SegmentDistributionChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className={cn("w-full", className)} {...props}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
