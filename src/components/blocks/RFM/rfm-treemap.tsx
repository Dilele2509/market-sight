"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ScoreBar from "./score-bar-rfm"

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


// Define a type for the treemap node that includes the properties added by d3.treemap()
type TreemapNode = d3.HierarchyNode<any> & {
    x0: number
    y0: number
    x1: number
    y1: number
}

export function RfmTreemap() {
    const svgRef = useRef<SVGSVGElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const [tab, setTab] = useState("R")

    useEffect(() => {
        if (!svgRef.current) return

        const width = svgRef.current.clientWidth
        const height = 500

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove()

        const margin = { top: 0, right: 0, bottom: 50, left: 70 }

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width - margin.left, height + margin.bottom])
            .style("font", "10px sans-serif")

        // Create hierarchy
        const root = d3.hierarchy({ children: rfmData }).sum((d) => (d as any).value)

        // Create treemap layout
        const treemap = d3.treemap().size([width, height]).paddingOuter(3).paddingInner(1)

        treemap(root)

        // Create tooltip
        const tooltip = d3
            .select(tooltipRef.current)
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("border-radius", "4px")
            .style("padding", "10px")
            .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)")
            .style("pointer-events", "none")
            .style("z-index", "10")

        // Create cells
        const cell = svg
            .selectAll("g")
            .data(root.leaves() as TreemapNode[])
            .join("g")
            .attr("transform", (d) => `translate(${d.x0},${d.y0})`)

        // Add rectangles
        cell
            .append("rect")
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("fill", (d) => generateColor[(d.data as any).name])
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible").html(`
                    <div class="font-medium">${(d.data as any).name}</div>
                    <div>Customers: ${(d.data as any).value.toLocaleString()}</div>
                    <div>Percentage: ${(d.data as any).percentage}</div>
                    <div>Avg Days: ${(d.data as any).days}</div>
                    <div>Orders: ${(d.data as any).orders.toLocaleString()}</div>
                    <div>Revenue: $${((d.data as any).revenue / 1000).toLocaleString()}K</div>
                    <div>R: ${(d.data as any).r}, F: ${(d.data as any).f}, M: ${(d.data as any).m}</div>
                  `)

                // Position tooltip
                const tooltipWidth = tooltipRef.current?.offsetWidth || 0
                const tooltipHeight = tooltipRef.current?.offsetHeight || 0
                const x = event.pageX + 10
                const y = event.pageY - tooltipHeight - 10

                tooltip.style("left", `${x}px`).style("top", `${y}px`)
            })
            .on("mousemove", (event) => {
                const tooltipWidth = tooltipRef.current?.offsetWidth || 0
                const x = event.pageX + 10
                const y = event.pageY - (tooltipRef.current?.offsetHeight || 0) - 10

                tooltip.style("left", `${x}px`).style("top", `${y}px`)
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden")
            })

        // Add text - percentage
        cell
            .append("text")
            .attr("x", 4)
            .attr("y", 17)
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .attr("font-size", "16px")
            .text((d) => (d.data as any).percentage)

        // Add text - value
        cell
            .append("text")
            .attr("x", 4)
            .attr("y", 35)
            .attr("fill", "white")
            .attr("font-size", "12px")
            .text((d) => (d.data as any).value.toLocaleString())

        // Add text - name (only for larger cells)
        cell
            .filter((d: TreemapNode) => d.x1 - d.x0 > 100 && d.y1 - d.y0 > 50)
            .append("text")
            .attr("x", 4)
            .attr("y", 55)
            .attr("fill", "white")
            .attr("font-size", "12px")
            .text((d) => (d.data as any).name)

        // Add axes labels
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Recency (days)")

        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Frequency + Monetary (orders + revenue)")

        // Add axis numbers
        for (let i = 1; i <= 5; i++) {
            svg
                .append("text")
                .attr("x", (width / 5) * i - width / 10)
                .attr("y", height + 20)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .text(i.toString())
        }

        for (let i = 1; i <= 5; i++) {
            svg
                .append("text")
                .attr("x", -20)
                .attr("y", (height / 5) * (5 - i) + height / 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .text(i.toString())
        }
    }, [])

    return (
        <div>
            <div className="grid grid-cols-11 w-full gap-3">
                {/* SVG section */}
                <div className="col-span-5">
                    <svg ref={svgRef} className="w-full" />
                    <div ref={tooltipRef} className="tooltip"></div>
                </div>

                {/* Segment Data - Name and Value */}
                <div className="col-span-3 gap-4 p-2">
                    <div className="flex justify-end mb-4">
                        <div className="text-sm font-medium">customers</div>
                    </div>
                    {rfmData.map((segment) => (
                        <div key={segment.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }}></div>
                                <div className="text-sm">{segment.name}</div>
                            </div>
                            <div className="text-sm">{segment.value.toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                {/* Days section */}
                <Card className="col-span-3 gap-4 bg-background p-4">
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="flex justify-between justify-center mb-4 w-full">
                            <div className="flex items-center space-x-2">
                                <TabsTrigger value="R">R</TabsTrigger>
                                <TabsTrigger value="F">F</TabsTrigger>
                                <TabsTrigger value="M">M</TabsTrigger>
                            </div>
                        </TabsList>

                        <TabsContent value="R">
                            {rfmData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.r} color={generateColor[segment.name]} />
                                    </div>
                                    <div>{segment.days}</div>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="F">
                            {rfmData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.f} color={generateColor[segment.name]} />
                                    </div>
                                    <div>{segment.orders.toLocaleString()}</div>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="M">
                            {rfmData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.m} color={generateColor[segment.name]} />
                                    </div>
                                    <div>${segment.revenue.toLocaleString()}</div>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}
