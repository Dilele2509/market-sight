import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import ProfileDialog from "./profileDialog";

interface AvatarConfigProps {
    className?: string;
}

const AvatarConfig: React.FC<AvatarConfigProps> = ({ className = "" }) => {
    const { user, logout } = useContext(AuthContext)
    const [openProfileDialog, setOpenProfileDialog] = useState(false)

    // useEffect(() => {
    //     console.log("User updated:", user);
    // }, [user]);

    const configAvaFromName = () => {
        if (!user || !user.first_name || !user.last_name) return "??"; // Trường hợp thiếu dữ liệu

        const firstChar = user.first_name.charAt(0).toUpperCase();
        const lastChar = user.last_name.charAt(0).toUpperCase();

        return firstChar + lastChar;
    };

    const menuItems = [
        {
            name: "Profile",
            shortcut: "⇧⌘P",
            onClick: () => { setOpenProfileDialog(!openProfileDialog)},
        },
        {
            name: "Business",
            shortcut: "⌘B",
            onClick: () => {
                console.log("Navigating to Business");
                // Điều hướng tới trang kinh doanh
            },
        },
        {
            name: "Keyboard Shortcuts",
            shortcut: "⌘K",
            onClick: () => {
                console.log("Navigating to Keyboard Shortcuts");
                // Điều hướng đến trang phím tắt
            },
        },
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-transparent w-fit p-0 hover:bg-transparent">
                    <Avatar
                        className={`${className} hover:shadow-lg hover:border-2 hover:border-primary-light transition-all duration-300`}
                    >
                        <AvatarFallback className="bg-primary-dark text-secondary-light">{configAvaFromName()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4 bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {menuItems.map((item, index) => (
                        <DropdownMenuItem className="hover:bg-gray-100 hover:rounded-md cursor-pointer" key={index} onClick={item.onClick}>
                            {item.name}
                            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> logout()} className="hover:bg-error hover:text-secondary hover:rounded-md cursor-pointer">
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
            <ProfileDialog
                openProfileDialog={openProfileDialog}
                setOpenProfileDialog={setOpenProfileDialog}
                user={user}
            />
        </DropdownMenu>
    )
}

export default AvatarConfig;