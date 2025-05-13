import { axiosPrivate } from "@/API/axios";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import AuthContext from "@/context/AuthContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import { Label } from "@radix-ui/react-label";
import { Download } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { GoogleSheetDialog } from "../../SyncData/googleSheetDialog";
import clsx from "clsx";
import { RequestAuth } from "../../SyncData/requestAuthDialog";

const RenderSync = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogOpenNotify, setDialogOpenNotify] = useState(false)
    const { previewData, segmentId, segmentName } = useSegmentData();
    const { token } = useContext(AuthContext)

    useEffect(() => {
        console.log("check preview from sync: ", previewData);
        console.log(segmentId);
    }, [previewData]);

    if (!previewData || previewData.length === 0) {
        return <h2>Press on Preview Result button above to show data before sync</h2>;
    }

    // Lấy danh sách các keys từ object đầu tiên để làm header
    const headers = Object.keys(previewData[0]);

    const headerToken = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const startInsertToState = async () => {
        try {
            const res = await axiosPrivate.post('/segment/add-state-sync', {
                segment_id: segmentId, data: previewData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                toast.success('Add to state success: ', res.data)
                const resTokenCheck = await axiosPrivate.get('/auth/status', headerToken)
                console.log('check res token: ',resTokenCheck);
                if (resTokenCheck.data?.data?.is_connected === true) {
                    toast.success('Verification of rights success')
                    setDialogOpen(true)
                } else {
                    console.error(resTokenCheck)
                    setDialogOpenNotify(true)
                }
            } else {
                console.log(res);
                toast.error('Error when add data to state')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleSync = async (option: 'create' | 'use', value: string) => {
        let req = {}

        if (option === 'create') {
            req = {
                segment_id: segmentId,
                segment_name: segmentName,
                create_new: true,
                new_file_name: value,
            }
            console.log('Create new file with name:', req)
        } else {
            req = {
                segment_id: segmentId,
                segment_name: segmentName,
                create_new: false,
                sheet_url: value,
            }
            console.log('Use existing sheet with link:', value)
        }

        try {
            const res = await axiosPrivate.post('/sync', req, headerToken)
            console.log(res);

            if (res.data.success === true) {
                toast.success('Sync success, check your Google Drive now')
            } else {
                toast.error('An error occurred during sync. See console for details.')
                console.error(res.data)
            }
        } catch (err) {
            toast.error('Request failed. Check console for details.')
            console.error('Sync error:', err)
        }
    }

    return (
        <div className="">
            <div className="flex w-full justify-end items-center gap-4">
                <Label className="text-sm font-medium">Click to sync:</Label>
                <Button className="text-card bg-primary-dark" onClick={startInsertToState}><Download />Sync Data</Button>
            </div>
            <div className="rounded-md border mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previewData.map((row: Record<string, any>, index: number) => (
                            <TableRow key={index}>
                                {headers.map((key) => (
                                    <TableCell key={key}>
                                        {typeof row[key] === "string" || typeof row[key] === "number"
                                            ? row[key]
                                            : JSON.stringify(row[key])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <RequestAuth open={dialogOpenNotify} onClose={() => setDialogOpenNotify(false)} />
            <GoogleSheetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSync={handleSync} />
        </div>
    );
};

export default RenderSync;
