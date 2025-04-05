"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter, Plus } from "lucide-react";
import { Segment, SegmentsListProps } from "@/types/segmentTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SegmentsList: React.FC<SegmentsListProps> = ({ segments = [], onCreateSegment, onEditSegment }) => {
    const [localSegments, setLocalSegments] = useState<Segment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggleStatus = (id: string) => {
        setLocalSegments((prev) =>
            prev.map((seg) =>
                seg.id === id
                    ? { ...seg, status: seg.status === "active" ? "inactive" : "active" }
                    : seg
            )
        );

        // Optional: update in localStorage if needed
        const storedSegments = JSON.parse(localStorage.getItem("segments") || "[]");
        const updated = storedSegments.map((seg: Segment) =>
            seg.id === id
                ? { ...seg, status: seg.status === "active" ? "inactive" : "active" }
                : seg
        );
        localStorage.setItem("segments", JSON.stringify(updated));
    };


    useEffect(() => {
        try {
            const storedSegments = JSON.parse(localStorage.getItem("segments") || "[]") as Segment[];
            const combinedSegments = [...segments];
            storedSegments.forEach((s) => {
                if (!combinedSegments.some((seg) => seg.id === s.id)) {
                    combinedSegments.push(s);
                }
            });
            setLocalSegments(combinedSegments);
        } catch (error) {
            console.error("Error loading segments from localStorage:", error);
        }
    }, [segments]);

    const filteredSegments = localSegments.filter((segment) =>
        segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.dataset.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (segment: Segment) => {
        if (onEditSegment) {
            onEditSegment(segment);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Segments</h1>
                <Button onClick={onCreateSegment}>
                    <Plus className="mr-2" size={16} /> Add a New Segment
                </Button>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Input
                        placeholder="Search segments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2" size={16} /> Filter
                </Button>
            </div>

            <Card>
                <Table className="w-full ">
                    <TableHead className="table-header-group">
                        <TableRow className="w-full">
                            <TableCell className="w-2/6 px-4 text-left">Name</TableCell>
                            <TableCell className="w-1/6 px-4 text-center">Dataset</TableCell>
                            <TableCell className="w-1/6 px-4 text-center">Last Updated</TableCell>
                            <TableCell className="w-1/6 px-4 text-center">Size</TableCell>
                            <TableCell className="w-1/6 px-4 text-center">Status</TableCell>
                            <TableCell className="w-1/6 px-4 text-center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="px-4">
                        {filteredSegments.length > 0 ? (
                            filteredSegments.map((segment) => (
                                <TableRow key={segment.id} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell className="px-4 text-left" onClick={() => handleRowClick(segment)}>
                                        {segment.name}
                                    </TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{segment.dataset}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{new Date(segment.last_updated).toLocaleDateString()}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{segment.size.toLocaleString()}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>
                                        <Badge className={`${segment.status === "active" ? "bg-primary" : "bg-error"} text-secondary`}>
                                            {segment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-center relative">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal size={16} className="absolute cursor-pointer hover:bg-gray-300 rounded-xl w-6 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="mr-4 bg-card">
                                                <DropdownMenuLabel>Action</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="hover:bg-gray-100"
                                                    onClick={() => handleToggleStatus(segment.id)}
                                                >
                                                    {segment.status === "active" ? "Disable" : "Enable"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-red-200 text-red-500">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                    No segments found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default SegmentsList;
