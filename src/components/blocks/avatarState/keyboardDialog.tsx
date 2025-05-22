import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Keyboard, Command } from "lucide-react"
import { useState } from "react"
import { formatShortcut } from "@/components/utils/shortcutFormatter.ts"

interface KeyboardDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface ShortcutItem {
    category: string
    items: {
        name: string
        shortcut: string
        description?: string
    }[]
}

export function KeyboardDialog({ open, onOpenChange }: KeyboardDialogProps) {
    const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([
        {
            category: "Điều hướng",
            items: [
                {
                    name: "Thông tin cá nhân",
                    shortcut: "⇧⌘P",
                    description: "Mở cài đặt thông tin cá nhân"
                },
                {
                    name: "Phím tắt",
                    shortcut: "⌘K",
                    description: "Hiển thị danh sách phím tắt"
                },
                {
                    name: "Đăng xuất",
                    shortcut: "⇧⌘L",
                    description: "Đăng xuất khỏi tài khoản"
                }
            ]
        }
    ])

    const [editingShortcut, setEditingShortcut] = useState<{
        category: string
        index: number
        shortcut: string
    } | null>(null)

    const handleShortcutEdit = (category: string, index: number, shortcut: string) => {
        setEditingShortcut({ category, index, shortcut })
    }

    const handleShortcutSave = (category: string, index: number, newShortcut: string) => {
        setShortcuts(prev => prev.map(cat => {
            if (cat.category === category) {
                const newItems = [...cat.items]
                newItems[index] = { ...newItems[index], shortcut: newShortcut }
                return { ...cat, items: newItems }
            }
            return cat
        }))
        setEditingShortcut(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-card">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Keyboard className="h-6 w-6" />
                        <DialogTitle>Phím tắt</DialogTitle>
                    </div>
                    <DialogDescription>
                        Tùy chỉnh phím tắt để điều hướng và thực hiện các thao tác nhanh hơn.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-8 py-4">
                        {shortcuts.map((category, categoryIndex) => (
                            <div key={category.category} className="space-y-4">
                                <h4 className="text-sm font-medium leading-none">{category.category}</h4>
                                <div className="space-y-2">
                                    {category.items.map((item, index) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            {editingShortcut?.category === category.category && 
                                             editingShortcut?.index === index ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        className="w-28 text-center"
                                                        value={editingShortcut.shortcut}
                                                        onChange={(e) => setEditingShortcut({
                                                            ...editingShortcut,
                                                            shortcut: e.target.value
                                                        })}
                                                        onKeyDown={(e) => {
                                                            e.preventDefault()
                                                            const shortcut = []
                                                            if (e.metaKey) shortcut.push('⌘')
                                                            if (e.shiftKey) shortcut.push('⇧')
                                                            if (e.altKey) shortcut.push('⌥')
                                                            if (e.key !== 'Meta' && e.key !== 'Shift' && e.key !== 'Alt') {
                                                                shortcut.push(e.key.toUpperCase())
                                                            }
                                                            setEditingShortcut({
                                                                ...editingShortcut,
                                                                shortcut: shortcut.join('')
                                                            })
                                                        }}
                                                    />
                                                    <Button 
                                                        size="sm"
                                                        onClick={() => handleShortcutSave(category.category, index, editingShortcut.shortcut)}
                                                    >
                                                        Lưu
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShortcutEdit(category.category, index, item.shortcut)}
                                                    className="w-28 justify-center"
                                                >
                                                    {formatShortcut(item.shortcut)}
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
