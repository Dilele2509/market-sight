"use client"

import React, { HTMLAttributes, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { addMonths, format, subMonths } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLifeContext } from "@/context/LifecycleContext"
//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DateRangePicker({ className }: HTMLAttributes<HTMLDivElement>) {
    const { date, setDate, timeRange, setTimeRange, setStartDate } = useLifeContext()

    // Tính ngày bắt đầu và ngày kết thúc
    useEffect(() => {
        if (date && timeRange) {
            setStartDate(subMonths(date, timeRange))
        } else {
            setStartDate(null)
        }
    }, [date, timeRange, setStartDate])
    const endDate = date || null

    return (
        <div className={cn("grid gap-4", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[300px] justify-start text-left font-normal", (!date || !timeRange) && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date && timeRange ? (
                            <span>
                                Last {timeRange} {timeRange === 1 ? "month" : "months"} from {format(date, "PPP")}
                            </span>
                        ) : (
                            <span>Select range and date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-background" align="end">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium">Select Time Range</label>
                            <Select
                                value={timeRange?.toString()}
                                onValueChange={(value) => {
                                    setTimeRange(parseInt(value))
                                }}
                            >
                                <SelectTrigger className="bg-background mt-1">
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent className="bg-card" position="popper">
                                    <SelectItem value="1">Last 1 month</SelectItem>
                                    <SelectItem value="3">Last 3 month</SelectItem>
                                    <SelectItem value="6">Last 6 months</SelectItem>
                                    <SelectItem value="9">Last 9 months</SelectItem>
                                    <SelectItem value="12">Last 12 months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Select Reference Date</label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Bảng Preview */}
            {/* {date && timeRange && (
                <div className="mt-4">
                    <div className="overflow-x-auto">
                        <Table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="px-4 py-2 border-b text-center">Time Range</TableHead>
                                    <TableHead className="px-4 py-2 border-b text-center">Reference Date</TableHead>
                                    <TableHead className="px-4 py-2 border-b text-center">Start Date</TableHead>
                                    <TableHead className="px-4 py-2 border-b text-center">End Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-muted/50">
                                    <TableCell className="px-4 py-2 border-b text-center">
                                        Last {timeRange} {timeRange === 1 ? "month" : "months"}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 border-b text-center">{format(date, "PPP")}</TableCell>
                                    <TableCell className="px-4 py-2 border-b text-center">{startDate ? format(startDate, "PPP") : "-"}</TableCell>
                                    <TableCell className="px-4 py-2 border-b text-center">{endDate ? format(endDate, "PPP") : "-"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )} */}
        </div>
    )
}
