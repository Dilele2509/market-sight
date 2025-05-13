import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RFMInterface } from "@/pages/MicroSegmentation/RFM";
import { useSyncContext } from "@/context/SyncContext";
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";
import { toast } from "sonner";
import { RequestAuth } from "../SyncData/requestAuthDialog";
import { Loader2 } from "lucide-react";
import { on } from "events";

interface SyncSettingsDialogProps {
    open: boolean;
    onClose: () => void;
    inputData: RFMInterface;
}

export const SyncSettingsDialog: React.FC<SyncSettingsDialogProps> = ({
    open,
    onClose,
    inputData,
}) => {
    const segmentsWithData = useMemo(
        () => inputData.segment_stats.filter((s) => s.count > 0),
        [inputData.segment_stats]
    );

    const [selectedSegments, setSelectedSegments] = useState<string>('');
    const [selectedTarget, setSelectedTarget] = useState<'create' | 'use'>('create');
    const [sheetValue, setSheetValue] = useState<string>("");
    const { sheetURL } = useSyncContext()
    const { token } = useContext(AuthContext)
    const [dialogOpenNotify, setDialogOpenNotify] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [syncRequest, setSyncRequest] = useState<any>(null);

    const headerToken = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        if (selectedTarget === 'use') setSheetValue(sheetURL)
    }, [selectedTarget])

    const handleSegmentChange = (value: string) => {
        setSelectedSegments(value);
    };

    const handleSync = () => {
        const formatSegmentId = (segment: string) => {
            return `segment:${segment.toLowerCase().replace(/\s+/g, "-")}`;
        };

        const customerList = inputData?.rfm_scores.filter(customer =>
            customer.segment === selectedSegments
        );

        if (selectedSegments && sheetValue && customerList?.length) {
            const segmentId = formatSegmentId(selectedSegments);

            const req = selectedTarget === 'create'
                ? {
                    segment_id: segmentId,
                    segment_name: selectedSegments,
                    create_new: true,
                    new_file_name: sheetValue,
                }
                : {
                    segment_id: segmentId,
                    segment_name: selectedSegments,
                    create_new: false,
                    sheet_url: sheetValue,
                };

            // Set data for dialog
            setPreviewData(customerList);
            setSyncRequest(req);
            setOpenPreviewDialog(true);
        }
    };

    const startInsertToState = async () => {
        try {
            setIsLoading(true)
            if (syncRequest?.segment_id && previewData.length > 0) {
                const res = await axiosPrivate.post('/segment/add-state-sync', {
                    segment_id: syncRequest?.segment_id, data: previewData
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.status === 200) {
                    toast.success('Add to state success: ', res.data?.message)
                    const resTokenCheck = await axiosPrivate.get('/auth/status', headerToken)
                    console.log('check res token: ', resTokenCheck);
                    if (resTokenCheck.data?.data?.is_connected === true) {
                        toast.success('Verification of rights success')
                        //tiếp tục xử lí đồng bộ lên sheet
                        try {
                            const res = await axiosPrivate.post('/sync', syncRequest, headerToken)
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
                    } else {
                        console.error(resTokenCheck)
                        setDialogOpenNotify(true)
                    }
                } else {
                    console.log(res);
                    toast.error('Error when add data to state')
                }
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setIsLoading(false)
            setOpenPreviewDialog(false)
            onClose()
        }
    }


    return (
        <>
            {!openPreviewDialog ?
                (<Dialog open={open} onOpenChange={onClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Đồng bộ dữ liệu RFM</DialogTitle>
                            <DialogDescription>
                                Chọn phân khúc và nơi đồng bộ dữ liệu khách hàng.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Select Segment */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Phân khúc đồng bộ</label>
                            <Select onValueChange={handleSegmentChange}>
                                <SelectTrigger className="bg-card">
                                    <SelectValue placeholder="Chọn phân khúc" />
                                </SelectTrigger>
                                <SelectContent className="bg-card">
                                    {segmentsWithData.map((seg) => (
                                        <SelectItem className="bg-card hover:bg-background" key={seg.segment} value={seg.segment}>
                                            {seg.segment} ({seg.count} khách hàng)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Select Sync Target */}
                        <div className="space-y-1 pt-4">
                            <label className="text-sm font-medium">Đồng bộ trên</label>
                            <Select onValueChange={(val: "create" | "use") => {
                                setSelectedTarget(val)
                                setSheetValue('')
                            }} value={selectedTarget}>
                                <SelectTrigger className="bg-card">
                                    <SelectValue placeholder="Chọn nơi đồng bộ" />
                                </SelectTrigger>
                                <SelectContent className="bg-card">
                                    <SelectItem className="bg-card hover:bg-background" value="create">Tạo tài liệu Google Sheet mới</SelectItem>
                                    <SelectItem className="bg-card hover:bg-background" value="use">Sử dụng Google Sheet sẵn có</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder={
                                    selectedTarget === "create"
                                        ? "Nhập tên Google Sheet mới"
                                        : "Nhập đường dẫn tài liệu trang tính của bạn"
                                }
                                className="mt-2"
                                value={sheetValue}
                                onChange={(e) => setSheetValue(e.target.value)}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button variant="outline" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSync}
                                disabled={selectedSegments.trim() === "" || sheetValue.trim() === ""}
                            >
                                Đồng bộ
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>) :
                (!dialogOpenNotify ?
                    <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
                        <DialogContent className="max-w-5xl">
                            <DialogHeader>
                                <DialogTitle>Xác nhận đồng bộ khách hàng</DialogTitle>
                            </DialogHeader>

                            <ScrollArea className="h-[400px] w-full">
                                <table className="w-full text-sm text-left border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border">Customer ID</th>
                                            <th className="px-4 py-2 border">Recency</th>
                                            <th className="px-4 py-2 border">Frequency</th>
                                            <th className="px-4 py-2 border">Monetary</th>
                                            <th className="px-4 py-2 border">Segment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">{row.customer_id}</td>
                                                <td className="px-4 py-2 border">{row.recency_value}</td>
                                                <td className="px-4 py-2 border">{row.frequency_value}</td>
                                                <td className="px-4 py-2 border">{row.monetary_value}</td>
                                                <td className="px-4 py-2 border">{row.segment}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>

                            <DialogFooter className="mt-4">
                                <Button variant="outline" onClick={() => setOpenPreviewDialog(false)}>
                                    Hủy
                                </Button>
                                <Button
                                    disabled={isLoading}
                                    onClick={startInsertToState}
                                    className="text-card-foreground flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Đang đồng bộ...
                                        </>
                                    ) : (
                                        "Xác nhận đồng bộ"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> : <RequestAuth open={dialogOpenNotify} onClose={() => { setDialogOpenNotify(false) }} />)}
        </>
    );
};
