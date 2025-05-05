"use client"

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MetricsLineGraphProps extends React.HTMLAttributes<HTMLDivElement> {
    data: any
}

export default function MetricsLineGraph({ data }: MetricsLineGraphProps) {

    // Custom tooltip styles
    const tooltipWrapperStyle = {
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        backgroundColor: "hsl(var(--background))",
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }

    const maxOrders = Math.max(...data.map((item) => item.Orders || 0));
    const maxCustomers = Math.max(...data.map((item) => item.Customers || 0));
    const maxYRight = Math.max(maxOrders, maxCustomers) * 2;

    return (
        <div className="w-full rounded-lg border bg-background p-6">
            <h2 className="mb-4 text-xl font-semibold">Business Metrics Over Time</h2>
            {data.length > 0 && <ChartContainer
                config={{
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
                }}
                className="min-h-[400px] tooltip-visible"
            >
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 50, // Increased right margin for the second Y-axis
                        left: 30,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />

                    {/* Left Y-axis for GMV */}
                    <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        domain={[0, "dataMax + 2000"]}
                        label={{ value: "GMV", angle: -90, position: "insideLeft", style: { textAnchor: "middle" }, dx: -15 }}
                    />

                    {/* Right Y-axis for Orders and Customers */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        domain={[0, maxYRight]}
                        label={{
                            value: "Orders & Customers",
                            angle: 90,
                            position: "insideRight",
                            style: { textAnchor: "middle" },
                            dx: 15,
                        }}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                className="border-2 bg-background p-2 shadow-lg"
                                formatter={(value, name) => {
                                    // Format GMV with currency symbol
                                    if (name === "GMV") {
                                        return [`$${value.toLocaleString()}` + ' ' + name]
                                    }
                                    // Format Orders and Customers as whole numbers
                                    return [value.toLocaleString() + ' ' + name]
                                }}
                            />
                        }
                        cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "3 3" }}
                        active={true}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />

                    {/* GMV line using left Y-axis */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="GMV"
                        stroke="var(--color-GMV)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--color-GMV)" }}
                        activeDot={{ r: 6, stroke: "var(--color-GMV)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    />

                    {/* Orders line using right Y-axis */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Orders"
                        stroke="var(--color-Orders)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--color-Orders)" }}
                        activeDot={{ r: 6, stroke: "var(--color-Orders)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    />

                    {/* Customers line using right Y-axis */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Customers"
                        stroke="var(--color-Customers)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--color-Customers)" }}
                        activeDot={{ r: 6, stroke: "var(--color-Customers)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    />
                </LineChart>
            </ChartContainer>}
        </div>
    )
}
