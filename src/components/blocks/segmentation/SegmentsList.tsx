"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter, Plus } from "lucide-react";
import { Segment, SegmentsListProps } from "@/types/segmentTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";
import { toast } from "sonner";

const SegmentsList: React.FC<SegmentsListProps> = ({ segments = [], onCreateSegment, onEditSegment }) => {
    const [localSegments, setLocalSegments] = useState<Segment[]>([]);
    const [segmentList, setSegmentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { user, token } = useContext(AuthContext);

    const fetchSegments = () => {
        try {
            axiosPrivate.post('/segment/get-all-by-user', { user_id: user.user_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((response) => {
                    if (response.data.status === 200) {
                        toast.success(response.data.message)
                    }
                    setSegmentList(response.data.data)
                })
                .catch((error) => {
                    console.error(error)
                    toast.error('have a error when get segment list: ', error)
                })
        } catch (error) {
            console.error("Error loading segments from localStorage:", error);
        }
    }

    useEffect(() => {
        try {
            fetchSegments();
        } catch (error) {
            console.error("Error loading segments:", error);
        }
    }, [segments]);

    const handleRowClick = (segment: Segment) => {
        if (onEditSegment) {
            onEditSegment(segment);
        }
    };

    const handleUpdateSegmentStatus = (segment: Segment) => {
        try {
            axiosPrivate.put('/segment/update-status', {
                segment_id: segment.segment_id,
                status: segment.status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success(res.data.message);
                        fetchSegments();
                    }
                    else toast.error(res.data.error)
                })
                .catch((err) => {
                    toast.error(err.message)
                })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteSegment = (segment: Segment) => {
        try {
            axiosPrivate.put('/segment/delete', {
                segment_id: segment.segment_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success(res.data.message);
                        fetchSegments();
                    }
                    else toast.error(res.data.error)
                })
                .catch((err) => {
                    toast.error(err.message)
                })
        } catch (error) {
            toast.error(error.message)
        }
    }


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
                    <TableHeader>
                        <TableRow className="w-full">
                            <TableHead className="w-2/6 px-4 text-left">ID</TableHead>
                            <TableHead className="w-1/6 px-4 text-left">Name</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Dataset</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Created at</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Last Updated</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Size</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Status</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="px-4">
                        {segmentList.length > 0 ? (
                            segmentList.map((segment) => (
                                <TableRow key={segment.segment_id} className="cursor-pointer hover:bg-background overflow-hidden">
                                    <TableCell className="px-4 text-left" onClick={() => handleRowClick(segment)}>
                                        {segment.segment_id}
                                    </TableCell>
                                    <TableCell className="px-4 text-left" onClick={() => handleRowClick(segment)}>
                                        {segment.segment_name}
                                    </TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{segment.dataset}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{new Date(segment.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{new Date(segment.updated_at).toLocaleString()}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{segment.filter_criteria.size.toLocaleString()}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>
                                        <Badge className={`${segment.status === "active" ? "bg-primary" : "bg-error"} text-secondary`}>
                                            {segment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal size={18} className=" cursor-pointer hover:bg-gray-300 rounded-xl  w-6 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="mr-4 bg-card">
                                                <DropdownMenuItem
                                                    className="hover:bg-gray-100"
                                                    onClick={() => handleUpdateSegmentStatus(segment)}
                                                >
                                                    {segment.status === "active" ? "Disable" : "Enable"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="hover:bg-red-200 text-red-500"
                                                    onClick={()=> handleDeleteSegment(segment)}>Delete</DropdownMenuItem>
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
