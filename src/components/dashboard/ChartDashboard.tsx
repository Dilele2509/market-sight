import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    TooltipProps,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { dashboardDataInterface } from "@/pages/Index"

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

// Custom tooltip content component for Pie Chart
const CustomPieTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; // Data of the hovered slice
        // Optional: calculate and show percentage
        // const percentage = (payload[0].percent * 100).toFixed(0);

        return (
            <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
                <p className="font-medium">{data.name}</p>
                <p>{`Số lượng: ${data.value}`}</p>
                {/* Optional: display percentage */}
                {/* <p>{`${percentage}%`}</p> */}
            </div>
        );
    }

    return null;
};

// Define label map for Bar Chart
const barChartLabelMap: Record<string, string> = {
    orders: "Đơn hàng",
    unique_customers: "Khách hàng",
};

// Area Chart Component
interface LineChartCardProps {
    title: string
    description?: string
    data: dashboardDataInterface[]
    dataKeys: string[]
    smallValueKeys: string[]
    xAxisDataKey: string
    height?: number
    valueFormatter?: (value: number) => string
}

// Update the LineChartCard component to better handle the specific metrics
export function LineChartCard({
    title,
    description,
    data,
    dataKeys,
    smallValueKeys = [],
    xAxisDataKey,
    height = 500,
    valueFormatter = (value) => `${value}`,
}: LineChartCardProps) {
    // Process the data to extract month names from period.start_date
    const processedData = data.map((item) => ({
        month: new Date(item.period.start_date).toLocaleString("vi-VN", { month: "long", year: "numeric" }),
        ...item.values,
    }))

    // Define colors for each line - using a more distinct color palette
    const colors = [
        "#2563eb", // blue-600
        "#dc2626", // red-600
        "#16a34a", // green-600
        "#9333ea", // purple-600
        "#ea580c", // orange-600
        "#0891b2", // cyan-600
        "#4f46e5", // indigo-600
        "#db2777", // pink-600
    ]

    // Create a more descriptive label mapping
    const labelMap: Record<string, string> = {
        gmv: "Tổng giá trị hàng hoá",
        orders: "Đơn hàng",
        unique_customers: "Khách hàng",
        aov: "Giá trị đơn hàng trung bình",
        avg_bill_per_user: "Mức chi tiêu trung bình mỗi khách hàng",
        arpu: "ARPU",
        orders_per_day: "Đơn hàng mỗi ngày",
        orders_per_day_per_store: "Đơn hàng/ngày/cửa hàng",
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart
                        data={processedData}
                        margin={{
                            top: 20,
                            right: 50,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis
                            yAxisId="left"
                            className="text-xs"
                            tickFormatter={valueFormatter}
                            domain={["auto", "auto"]}
                            label={{ value: "Giá trị tiền tệ", angle: -90, position: "insideLeft" }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            className="text-xs"
                            tickFormatter={valueFormatter}
                            domain={["auto", "auto"]}
                            label={{ value: "Số lượng", angle: 90, position: "insideRight" }}
                        />
                        <Tooltip formatter={(value, name) => [valueFormatter(value as number), labelMap[name as string] || name]} />
                        <Legend formatter={(value) => labelMap[value] || value} />
                        {dataKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                name={key}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                yAxisId={smallValueKeys.includes(key) ? "right" : "left"}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Bar Chart Component
interface BarChartCardProps {
    title: string
    description?: string
    data: dashboardDataInterface[]
    barKeys: string[]
    xAxisDataKey: string
    height?: number
    valueFormatter?: (value: number) => string
}

function CustomTooltipBarContent({
    active,
    payload,
    label,
    formatter = (value: number) => value.toString(),
}: TooltipProps<any, any> & { formatter?: (value: number) => string }) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
            <div className="font-medium mb-1">{label}</div>
            {payload.map((entry, index) => (
                <div key={index} className="flex justify-between gap-2">
                    <span className="capitalize" style={{ color: entry.color }}>
                        {barChartLabelMap[entry.name as string] || String(entry.name).replace(/_/g, " ")} 
                    </span>
                    <span>{formatter(Number(entry.value))}</span>
                </div>
            ))}
        </div>
    );
}

function transformBarChartData(data: dashboardDataInterface[]) {
    return data.map((item) => {
        const month = new Date(item.period.start_date).toISOString().slice(0, 7); // e.g. "2025-02"
        return {
            month,
            orders: item.values.orders,
            unique_customers: item.values.unique_customers,
        };
    });
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
    const transformedData = transformBarChartData(data);
    // Map data keys to Vietnamese labels in config
    barKeys.forEach((key, index) => {
        config[key] = {
            label: barChartLabelMap[key] || key, // Use Vietnamese label or key
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
                            data={transformedData}
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
                            <Tooltip
                                content={(props) => <CustomTooltipBarContent {...props} formatter={valueFormatter} />}
                            />
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
    data: dashboardDataInterface[]
    dataKey: string
    nameKey: string
    height?: number
    colors?: string[]
    valueFormatter?: (value: number) => string
}

function groupAOVRanges(data: dashboardDataInterface[]) {
    const result = {
        "< 500": 0,
        "500 – 1000": 0,
        "1000 – 1500": 0,
        "1500 – 2000": 0,
        "2000 – 2500": 0,
        "2500 – 3000": 0,
        "3000 – 4000": 0,
        "4000 – 5000": 0,
        "> 5000": 0,
    };

    data.forEach((item) => {
        const aov = item.values.aov;
        if (aov < 500) result["< 500"]++;
        else if (aov < 1000) result["500 – 1000"]++;
        else if (aov < 1500) result["1000 – 1500"]++;
        else if (aov < 2000) result["1500 – 2000"]++;
        else if (aov < 2500) result["2000 – 2500"]++;
        else if (aov < 3000) result["2500 – 3000"]++;
        else if (aov < 4000) result["3000 – 4000"]++;
        else if (aov < 5000) result["4000 – 5000"]++;
        else result["> 5000"]++;
    });

    // Chỉ trả về những mục có value > 0
    return Object.entries(result)
        .map(([name, value]) => ({ name, value }))
        .filter(entry => entry.value > 0);
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
    const transformedData = groupAOVRanges(data)
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
                            data={transformedData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey={dataKey}
                            nameKey={nameKey}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {transformedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={<CustomPieTooltipContent />}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
