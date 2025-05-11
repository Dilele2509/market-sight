import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

// Custom tooltip content component
export const CustomTooltipContent = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                        <span className="font-bold text-foreground">
                            {formatter ? formatter(payload[0].value) : payload[0].value}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

// Area Chart Component
interface AreaChartCardProps {
    title: string
    description?: string
    data: any[]
    dataKey: string
    xAxisDataKey: string
    height?: number
    valueFormatter?: (value: number) => string
}

export function AreaChartCard({
    title,
    description,
    data,
    dataKey,
    xAxisDataKey,
    height = 200,
    valueFormatter = (value) => `${value}`,
}: AreaChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        [dataKey]: {
                            label: dataKey,
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                >
                    <ResponsiveContainer width="100%" height={height}>
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            height={150}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey={xAxisDataKey} className="text-xs" />
                            <YAxis className="text-xs" tickFormatter={valueFormatter} />
                            <Tooltip content={(props) => <CustomTooltipContent {...props} formatter={valueFormatter} />} />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke="var(--color-value)"
                                fill="var(--color-value)"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// Bar Chart Component
interface BarChartCardProps {
    title: string
    description?: string
    data: any[]
    barKeys: string[]
    xAxisDataKey: string
    height?: number
    valueFormatter?: (value: number) => string
}

export function BarChartCard({
    title,
    description,
    data,
    barKeys,
    xAxisDataKey,
    height = 300,
    valueFormatter = (value) => `${value}`,
}: BarChartCardProps) {
    // Create config object for ChartContainer
    const config: Record<string, { label: string; color: string }> = {}
    barKeys.forEach((key, index) => {
        config[key] = {
            label: key,
            color: `hsl(var(--chart-${index + 1}))`,
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className={`h-[${height}px]`}>
                <ChartContainer config={config}>
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey={xAxisDataKey} className="text-xs" />
                            <YAxis className="text-xs" tickFormatter={valueFormatter} />
                            <Tooltip content={(props) => <CustomTooltipContent {...props} formatter={valueFormatter} />} />
                            <Legend />
                            {barKeys.map((key, index) => (
                                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// Pie Chart Component
interface PieChartCardProps {
    title: string
    description?: string
    data: any[]
    dataKey: string
    nameKey: string
    height?: number
    colors?: string[]
    valueFormatter?: (value: number) => string
}

export function PieChartCard({
    title,
    description,
    data,
    dataKey,
    nameKey,
    height = 300,
    colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
    valueFormatter = (value) => `${value}`,
}: PieChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className={`h-[${height}px]`}>
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey={dataKey}
                            nameKey={nameKey}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [valueFormatter(value as number), "Count"]} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
