import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
    title: string
    value: string
    change: string
    trend: "up" | "down" | "neutral"
    description: string
    icon?: React.ReactNode
}

export function MetricCard({ title, value, change, trend, description, icon }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center space-x-1">
                    <span className={cn("text-xs", trend === "up" && "text-emerald-500", trend === "down" && "text-rose-500")}>
                        {change}
                    </span>
                    {trend === "up" && <ArrowUp className="h-3 w-3 text-emerald-500" />}
                    {trend === "down" && <ArrowDown className="h-3 w-3 text-rose-500" />}
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
            </CardContent>
        </Card>
    )
}
