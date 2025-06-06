﻿import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";

export default function ConnectionDialog() {
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useContext(AuthContext)

    const { loading, setLoading, setConnectionDialog, connectionDialog } = useSegmentToggle();
    const { ONE_HOUR_MS, CONNECTION_EXPIRY_KEY, CONNECTION_STORAGE_KEY, setTables, setError, connectionUrl, setConnectionUrl } = useSegmentData();

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get('/data/tables', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Fetched tables:', response.data);
            setTables(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Không thể tải bảng';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const testConnection = async () => {
        if (!connectionUrl.trim()) {
            toast.error('Vui lòng cung cấp URL kết nối');
            return;
        }

        try {
            setLoading(true);

            // Basic validation of URL format
            if (!connectionUrl.startsWith('postgresql://')) {
                toast.error('URL kết nối phải bắt đầu bằng postgresql://');
                return;
            }

            // Log the request data
            console.log(connectionUrl);

            const response = await axiosPrivate.post(`/data/test-connection`, {
                connection_url: connectionUrl
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Connection test response:', response.data);

            if (response.data.success) {
                toast.success('Kết nối thành công!');
            }
        } catch (err) {
            console.error('Connection test error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.detail || 'Kiểm tra kết nối không thành công';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectionSubmit = () => {
        if (!connectionUrl.trim()) {
            toast.error('Please provide a connection URL');
            return;
        }

        // Validate PostgreSQL connection URL format
        const urlRegex = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/[^/]+$/;
        if (!urlRegex.test(connectionUrl)) {
            toast.error('Định dạng URL kết nối PostgreSQL không hợp lệ. Mong muốn: postgresql://user:password@host:port/database');
            return;
        }

        // Store connection URL with expiry time
        const ONE_HOUR_MS = 60 * 60 * 1000;
        const now = Date.now();
        const expiryTime = now + ONE_HOUR_MS;

        localStorage.setItem(CONNECTION_STORAGE_KEY, connectionUrl);
        localStorage.setItem(CONNECTION_EXPIRY_KEY, expiryTime.toString());

        setConnectionDialog(!connectionDialog);
        toast.success('Chi tiết kết nối được lưu trong 1 giờ');

        // Fetch tables after successful connection
        fetchTables();
    };

    return (
        <Dialog open={connectionDialog} onOpenChange={() => setConnectionDialog(!connectionDialog)}>
            <DialogContent className="min-w-fit rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Chi tiết kết nối PostgreSQL</DialogTitle>
                    <DialogDescription>
                        Cung cấp thông tin kết nối PostgreSQL của bạn để tiếp tục.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Định dạng URL kết nối</h3>
                    <Card className="p-4 bg-background border border-gray-300 rounded-md">
                        <p className="font-mono break-all text-sm">
                            postgresql://[your_username]:[your_password]@[your_host]:[your_port]/[your_database]
                        </p>
                    </Card>
                    <p className="text-sm text-gray-600">
                        Kết nối này sử dụng Supabase Transaction Pooler (Supavisor), lý tưởng cho các ứng dụng không trạng thái. Thông tin kết nối sẽ được lưu trữ an toàn trong 1 giờ.
                    </p>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="URL kết nối PostgreSQL"
                            value={connectionUrl || ''}
                            onChange={(e) => setConnectionUrl(e.target.value)}
                            className="pr-10 py-2 w-full"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <Alert className="border-l-4 border-yellow-500 bg-yellow-100/90 text-yellow-900 shadow-md rounded-lg p-4">
                        <AlertTitle className="text-sm font-semibold">⚠️ Lưu ý</AlertTitle>
                        <AlertDescription className="text-xs font-medium leading-relaxed">
                            Đảm bảo dự án Supabase của bạn cho phép kết nối từ địa chỉ IP hiện tại của bạn.
                            Bạn có thể cấu hình điều này trong cài đặt dự án Supabase của bạn.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setConnectionDialog(!connectionDialog)}>Hủy bỏ</Button>
                    <Button variant="outline" onClick={testConnection} disabled={!connectionUrl || loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Kiểm tra kết nối"}
                    </Button>
                    <Button onClick={handleConnectionSubmit} disabled={!connectionUrl || loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Kết nối"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}