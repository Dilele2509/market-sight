"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Generate a color based on the name
const generateColor: Record<string, string> = {
    "Champions": "#1D5C4D",         // Dark Teal
    "Loyal Customers": "#4D8C8C",   // Dark Turquoise
    "Potential Loyalist": "#6A9F86",// Dark Mint Green
    "New Customers": "#4A91D6",     // Medium Sky Blue
    "Promising": "#86C3E6",         // Soft Ice Blue
    "Need Attention": "#EA8D00",    // Warm Yellow-Orange
    "About To Sleep": "#5A8A9D",    // Dusty Powder Blue
    "Can't Lose Them": "#FF9B4B",   // Warm Orange
    "At Risk": "#F24A4A",           // Soft Red
    "Hibernating": "#4B8FB7",       // Medium Powder Blue
    "Lost": "#B85B5B",              // Soft Red (for Lost, if you want to add color for Lost)
};

interface RfmSegmentTableProps {
    rfmData: {
        "customer_id": string,
        "business_id": number,
        "recency_value": number,
        "frequency_value": number,
        "monetary_value": number,
        "r_score": number,
        "f_score": number,
        "m_score": number,
        "segment": string,
        "last_updated": string
    }[];
}

export function RfmSegmentTable({ rfmData }: RfmSegmentTableProps) {
    const [tab, setTab] = useState("Champions")
    const tabList = [
        "Champions",
        "Loyal Customers",
        "Potential Loyalist",
        "New Customers",
        "Promising",
        "Need Attention",
        "About To Sleep",
        "Can't Lose ThemM",
        "At Risk",
        "Hibernating",
        "Lost"
    ]
    return (
        <>
            <Tabs value={tab} onValueChange={setTab}>
                <div className="w-full overflow-x-auto">
                    <TabsList className="flex mb-4 min-w-max whitespace-nowrap">
                        {tabList.map((tab, index) => (
                            <TabsTrigger
                                key={index}
                                value={tab}
                                className="shrink-0 px-4 hover:bg-gray-300 hover:rounded-md"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {tabList.map((tab, index) => (
                    <TabsContent key={index} value={tab}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer ID</TableHead>
                                    <TableHead>Business ID</TableHead>
                                    <TableHead>Recency</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Monetary</TableHead>
                                    <TableHead>R</TableHead>
                                    <TableHead>F</TableHead>
                                    <TableHead>M</TableHead>
                                    <TableHead>Last updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rfmData
                                    .filter(segment => segment.segment === tab)
                                    .map((segment) => (
                                        <TableRow key={segment.customer_id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: generateColor[segment.segment] }}
                                                    ></div>
                                                    <span>{segment.customer_id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{segment.business_id}</TableCell>
                                            <TableCell>{segment.recency_value}</TableCell>
                                            <TableCell>{segment.frequency_value}</TableCell>
                                            <TableCell>{segment.monetary_value}</TableCell>
                                            <TableCell>{segment.r_score}</TableCell>
                                            <TableCell>{segment.f_score}</TableCell>
                                            <TableCell>{segment.m_score}</TableCell>
                                            <TableCell>{segment.last_updated}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                ))}
            </Tabs>
        </>

    )
}
