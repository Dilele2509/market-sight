"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { cn } from "@/lib/utils"

interface CustomerLifecycleChartProps extends React.HTMLAttributes<HTMLDivElement> { }

const data = [
    {
        month: "Jan",
        new: 1200,
        early: 4100,
        mature: 9800,
        loyal: 4200,
    },
    {
        month: "Feb",
        new: 1300,
        early: 4300,
        mature: 10200,
        loyal: 4400,
    },
    {
        month: "Mar",
        new: 1400,
        early: 4600,
        mature: 10800,
        loyal: 4600,
    },
    {
        month: "Apr",
        new: 1500,
        early: 4800,
        mature: 11200,
        loyal: 4800,
    },
    {
        month: "May",
        new: 1600,
        early: 5000,
        mature: 11800,
        loyal: 5000,
    },
    {
        month: "Jun",
        new: 1642,
        early: 5237,
        mature: 12468,
        loyal: 5545,
    },
]

export function CustomerLifecycleChart({ className, ...props }: CustomerLifecycleChartProps) {
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
