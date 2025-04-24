"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// RFM segment data
// orders = value * f
// revenue = value * f * m * 10
// RFM segment data
const rfmData = [
    { name: "Champions", value: 7960, percentage: "13%", r: 5, f: 5, m: 5, days: 145, orders: 39800, revenue: 1990000 },
    { name: "Loyal Customers", value: 8603, percentage: "14%", r: 3, f: 5, m: 5, days: 579, orders: 43015, revenue: 2150750 },
    { name: "Potential Loyalist", value: 4569, percentage: "7%", r: 5, f: 3, m: 3, days: 399, orders: 13707, revenue: 1233090 },
    { name: "New Customers", value: 2672, percentage: "4%", r: 5, f: 1, m: 1, days: 279, orders: 2672, revenue: 26720 },
    { name: "Promising", value: 4546, percentage: "7%", r: 4, f: 1, m: 1, days: 507, orders: 4546, revenue: 45460 },
    { name: "Need Attention", value: 8741, percentage: "14%", r: 3, f: 2, m: 3, days: 683, orders: 17482, revenue: 524460 },
    { name: "About to Sleep", value: 480, percentage: "1%", r: 3, f: 1, m: 3, days: 679, orders: 480, revenue: 14400 },
    { name: "Can't lose them", value: 954, percentage: "2%", r: 2, f: 5, m: 5, days: 826, orders: 4770, revenue: 238500 },
    { name: "At Risk", value: 4954, percentage: "8%", r: 2, f: 4, m: 3, days: 881, orders: 19816, revenue: 594480 },
    { name: "Hibernating", value: 19053, percentage: "30%", r: 1, f: 2, m: 1, days: 928, orders: 38106, revenue: 381060 },
]

// Generate a color based on the name
const generateColor: Record<string, string> = {
    "Champions": "#1D5C4D",         // Dark Teal
    "Loyal Customers": "#4D8C8C",   // Dark Turquoise
    "Potential Loyalist": "#6A9F86",// Dark Mint Green
    "New Customers": "#4A91D6",     // Medium Sky Blue
    "Promising": "#86C3E6",         // Soft Ice Blue
    "Need Attention": "#EA8D00",    // Warm Yellow-Orange
    "About to Sleep": "#5A8A9D",    // Dusty Powder Blue
    "Can't lose them": "#FF9B4B",   // Warm Orange
    "At Risk": "#F24A4A",           // Soft Red
    "Hibernating": "#4B8FB7",       // Medium Powder Blue
};

export function RfmSegmentTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Avg Days</TableHead>
                    <TableHead>Avg Orders</TableHead>
                    <TableHead>Avg Revenue</TableHead>
                    <TableHead>R</TableHead>
                    <TableHead>F</TableHead>
                    <TableHead>M</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rfmData.map((segment) => (
                    <TableRow key={segment.name}>
                        <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: generateColor[segment.name] }}></div>
                                <span>{segment.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{segment.value.toLocaleString()}</TableCell>
                        <TableCell>{segment.percentage}</TableCell>
                        <TableCell>{segment.days}</TableCell>
                        <TableCell>{segment.orders}</TableCell>
                        <TableCell>{segment.revenue}</TableCell>
                        <TableCell>{segment.r}</TableCell>
                        <TableCell>{segment.f}</TableCell>
                        <TableCell>{segment.m}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
