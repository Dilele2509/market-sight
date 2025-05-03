"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface RfmSegmentTableProps {
    rfmData: {
        name: string;
        value: number;
        percentage: string;
        r: number;
        f: number;
        m: number;
        days: number;
        orders: number;
        revenue: number;
    }[];
}

export function RfmSegmentTable({ rfmData }: RfmSegmentTableProps) {
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
