import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SelectItem } from "@/components/ui/select";

interface ProfileDialogProps {
    openProfileDialog: boolean;
    setOpenProfileDialog: (open: boolean) => void;
    user: {
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
        setIsEditing((prev) => !prev);
    };

    const handleChange = (field: string, value: string) => {
        setEditedUser((prevState) => {
            const updatedUser = { ...prevState, [field]: value };
            setHasChanges(JSON.stringify(updatedUser) !== JSON.stringify(user)); // Check if there's any change
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
                return "Admin";
            case 2:
                return "Data team";
            case 3:
                return "Marketing team";
            default:
                return "Unknown role";
        }
    };

    return (
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogDescription>
                        Below are the details of the user's profile. You can update any information here.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Business ID */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Business ID:</div>
                        <div className="text-gray-700">{user.business_id}</div>
                    </div>

                    {/* Email */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Email:</div>
                        {isEditing ? (
                            <Input
                                type="email"
                                value={editedUser.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="input input-bordered w-full max-w-xs"
                            />
                        ) : (
                            <div className="text-gray-700">{user.email}</div>
                        )}
                    </div>

                    {/* First Name */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">First Name:</div>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={editedUser.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                className="input input-bordered w-full max-w-xs"
                            />
                        ) : (
                            <div className="text-gray-700">{user.first_name}</div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Last Name:</div>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={editedUser.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                className="input input-bordered w-full max-w-xs"
                            />
                        ) : (
                            <div className="text-gray-700">{user.last_name}</div>
                        )}
                    </div>

                    {/* Role ID */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Role ID:</div>
                        <div className="text-gray-700">
                            {user.role_id} - {generateRoleName(user.role_id)}
                        </div>
                    </div>

                    {/* Created and Updated At */}
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Created At:</div>
                        <div className="text-gray-700">{new Date(user.created_at).toLocaleString()}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">Updated At:</div>
                        <div className="text-gray-700">{new Date(user.updated_at).toLocaleString()}</div>
                    </div>

                    {/* Action Buttons */}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeDialog}>
                            Close
                        </Button>

                        {/* Edit/Cancel Button */}
                        <Button
                            variant="outline"
                            className={`${isEditing ? 'border-error text-error' : ''}`}
                            onClick={handleEdit}
                            disabled={isEditing && !hasChanges}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>

                        {/* Save Changes Button */}
                        <Button
                            className="bg-primary"
                            onClick={handleUpdate}
                            disabled={!hasChanges || !isEditing}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
