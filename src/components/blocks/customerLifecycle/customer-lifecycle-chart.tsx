"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { cn } from "@/lib/utils"

interface dataObject {

}

interface CustomerLifecycleChartProps extends React.HTMLAttributes<HTMLDivElement> { 
    data: any
}

export function CustomerLifecycleChart({ data, className, ...props }: CustomerLifecycleChartProps) {
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
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="new" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" name="New Customers" />
                    <Area
                        type="monotone"
                        dataKey="early"
                        stackId="1"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        name="Early-life Customers"
                    />
                    <Area type="monotone" dataKey="mature" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" name="Mature Customers" />
                    <Area type="monotone" dataKey="loyal" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" name="Loyal Customers" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
