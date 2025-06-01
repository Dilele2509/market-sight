import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoaderCircle, User2, Mail, Building2, UserRound, Calendar, BadgeHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProfileDialogProps {
    openProfileDialog: boolean;
    setOpenProfileDialog: (open: boolean) => void;
    user?: {
        business_id: number;
        created_at: string;
        email: string;
        first_name: string;
        last_name: string;
        role_id: number;
        updated_at: string;
        user_id: number;
    };
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ openProfileDialog, setOpenProfileDialog, user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [hasChanges, setHasChanges] = useState(false);

    const closeDialog = () => setOpenProfileDialog(false);

    const handleEdit = () => {
        if (isEditing) {
            setEditedUser({ ...user }); // Reset changes on cancel
        }
        setIsEditing((prev) => !prev);
        setHasChanges(false);
    };

    const handleChange = (field: string, value: string) => {
        setEditedUser((prevState) => {
            const updatedUser = { ...prevState, [field]: value };
            setHasChanges(JSON.stringify(updatedUser) !== JSON.stringify(user));
            return updatedUser;
        });
    };

    const handleUpdate = () => {
        // Logic to save the changes (e.g., API call to update the user data)
        console.log("Updated user:", editedUser);
        setIsEditing(false);
        setHasChanges(false);
    };

    const generateRoleName = (roleId: number) => {
        switch (roleId) {
            case 1:
                return { name: "Quản trị viên", color: "bg-red-500" };
            case 2:
                return { name: "Nhóm Data", color: "bg-blue-500" };
            case 3:
                return { name: "Nhóm marketing", color: "bg-green-500" };
            default:
                return { name: "Chưa xác định", color: "bg-gray-500" };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
            <DialogContent className="sm:max-w-[600px] bg-card">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <User2 className="h-6 w-6" />
                        <DialogTitle>Thông tin cá nhân</DialogTitle>
                    </div>
                    <DialogDescription>
                        Xem và quản lý thông tin cá nhân của bạn
                    </DialogDescription>
                </DialogHeader>

                {user ? (
                    <ScrollArea className="max-h-[600px] pr-4">
                        <div className="space-y-6 py-4">
                            {/* User Info Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium leading-none">Thông tin cơ bản</h4>
                                <Separator />
                                
                                {/* Email Field */}
                                <div className="rounded-lg border p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">Địa chỉ email</span>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={editedUser.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            className="h-9"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">{user.email}</p>
                                    )}
                                </div>

                                {/* Name Fields */}
                                <div className="rounded-lg border p-4 space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <UserRound className="h-4 w-4" />
                                        <span className="text-sm">Họ và tên</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Tên</label>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    value={editedUser.first_name}
                                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                                    className="h-9"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">{user.first_name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Họ</label>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    value={editedUser.last_name}
                                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                                    className="h-9"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">{user.last_name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Business & Role Info */}
                                <div className="rounded-lg border p-4 space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="h-4 w-4" />
                                        <span className="text-sm">Thông tin tổ chức</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Mã doanh nghiệp</label>
                                            <p className="text-sm font-medium">{user.business_id}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Vai trò</label>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className={`${generateRoleName(user.role_id).color} text-white`}>
                                                    {generateRoleName(user.role_id).name}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="rounded-lg border p-4 space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Thời gian</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Ngày tạo</label>
                                            <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Cập nhật lần cuối</label>
                                            <p className="text-sm font-medium">{formatDate(user.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                <DialogFooter className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={closeDialog}
                    >
                        Đóng
                    </Button>
                    <Button
                        variant={isEditing ? "destructive" : "outline"}
                        onClick={handleEdit}
                    >
                        {isEditing ? "Hủy" : "Chỉnh sửa"}
                    </Button>
                    {isEditing && (
                        <Button
                            variant="default"
                            onClick={handleUpdate}
                            disabled={!hasChanges}
                        >
                            Lưu thay đổi
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
